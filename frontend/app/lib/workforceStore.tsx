'use client'

/**
 * Client-side Workforce store implementing the verification-first onboarding
 * workflow (see 04-WORKFLOWS.md). State is persisted to localStorage so the
 * whole app shares one live dataset across pages without a backend.
 */

import React, { createContext, useContext, useEffect, useReducer } from 'react'

export type WorkerType = 'Employee' | 'Contractor' | 'Intern' | 'Global Contractor' | 'Global Intern'
export type DocStatus = 'not_uploaded' | 'pending' | 'approved' | 'rejected'
export type Stage =
  | 'invited'            // token created, awaiting uploads
  | 'documents_submitted'// worker submitted all docs
  | 'verifying'          // HR reviewing
  | 'verified'           // all docs approved, ready for account
  | 'active'             // account created, worker onboarded

export const REJECT_REASONS = ['Unclear / Blurry', 'Expired', 'Invalid', 'Incomplete', 'Wrong Document']

export interface WorkerDoc {
  key: string
  label: string
  fileName?: string
  status: DocStatus
  reason?: string
  uploadedAt?: string
}

export type GoalPeriod = 'weekly' | 'monthly' | 'yearly'
export interface Goal {
  id: string
  title: string
  deadline?: string
  status: 'todo' | 'in_progress' | 'completed'
  period: GoalPeriod
}

export interface NoteItem {
  id: string
  kind: 'note' | 'todo'
  text: string
  done?: boolean // only meaningful for kind === 'todo'
  createdAt: string
}

export type AttendanceStatus = 'present' | 'wfh' | 'leave' | 'absent'
export type LeaveType = 'Paid Leave' | 'Unpaid Leave'
export const LEAVE_TYPES: LeaveType[] = ['Paid Leave', 'Unpaid Leave']

export interface AttendanceRecord {
  date: string // 'YYYY-MM-DD'
  status: AttendanceStatus
  leaveType?: LeaveType // only set when status === 'leave'
  markedAt: string
}

/* Clock in/out session for hourly time tracking */
export type PunchPlace = 'In office' | 'Remote' | 'Outside geofence' | 'Location off' | 'HR-entered'
export interface PunchMeta {
  source: 'self' | 'hr'   // who recorded it
  place: PunchPlace       // geofence classification at punch time
  lat?: number
  lon?: number
}
export interface TimeSession {
  id: string
  date: string   // 'YYYY-MM-DD' the session started on
  in: string     // ISO clock-in timestamp
  out?: string   // ISO clock-out timestamp; undefined = still clocked in
  inMeta?: PunchMeta
  outMeta?: PunchMeta
}

export type ProjectStatus = 'in_progress' | 'completed' | 'on_hold'
export interface Project {
  id: string
  name: string
  lead: string
  startDate: string
  status: ProjectStatus
}

/* Performance management */
export type ReviewPeriod = '30-day' | '60-day' | '90-day' | 'Annual'
export const REVIEW_PERIODS: ReviewPeriod[] = ['30-day', '60-day', '90-day', 'Annual']
export interface Review {
  id: string
  period: ReviewPeriod
  rating: number // 1–5
  feedback: string
  reviewer: string
  createdAt: string
}
export interface FeedbackNote {
  id: string
  text: string
  author: string
  createdAt: string
}

/* Leave management */
export type LeaveStatus = 'pending' | 'approved' | 'rejected'
export interface LeaveRequest {
  id: string
  workerId: string
  type: LeaveType
  from: string   // 'YYYY-MM-DD'
  to: string     // 'YYYY-MM-DD'
  days: number   // business days (weekends excluded)
  reason: string
  status: LeaveStatus
  decidedBy?: string
  decidedAt?: string
  createdAt: string
}
export interface Holiday { id: string; date: string; name: string }

/** Annual leave quota per type; null = uncapped (Unpaid Leave). */
export const LEAVE_QUOTAS: Record<LeaveType, number | null> = {
  'Paid Leave': 12,
  'Unpaid Leave': null, // uncapped for now (quota TBD)
}

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract'
export type EmployeeStatus = 'active' | 'inactive'

export const TIMEZONES = [
  'IST (UTC+5:30)', 'PST (UTC-8:00)', 'EST (UTC-5:00)', 'CST (UTC-6:00)',
  'GMT (UTC+0:00)', 'CET (UTC+1:00)', 'SGT (UTC+8:00)', 'AEST (UTC+10:00)',
]

export interface Worker {
  id: string
  token: string

  // Identity
  firstName: string
  lastName: string
  name: string // derived: `${firstName} ${lastName}`, kept for display convenience
  gender: Gender
  dob?: string
  about?: string

  // Contact
  personalEmail: string
  professionalEmail: string
  phone: string

  // Address
  country: string
  state: string
  address: string
  pincode: string
  timezone: string

  // Employment
  type: WorkerType             // Employee / Contractor / Intern / Global Contractor / Global Intern
  employmentType: EmploymentType
  designation: string
  department: string
  hrLead: string                // exactly one HR lead per worker
  teamLeads: string[]           // one or more team leads
  location: string
  status: EmployeeStatus
  dateOfJoining: string
  dateOfExit?: string
  workExperience?: string

  // Onboarding (verification-first workflow)
  createdAt: string
  expiresAt: string
  stage: Stage
  accountCreated: boolean
  documents: WorkerDoc[]

  // Performance & self-service
  goals: Goal[]
  notes: NoteItem[]
  attendance: AttendanceRecord[]
  timeSessions: TimeSession[]
  projects: Project[]
  reviews: Review[]
  feedback: FeedbackNote[]
}

export interface Notification {
  id: string
  workerId?: string
  title: string
  message: string
  kind: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

export interface Activity {
  id: string
  message: string
  color: string
  createdAt: string
}

/* Required documents per worker type */
export const DOC_TEMPLATES: Record<WorkerType, { key: string; label: string }[]> = {
  Employee: [
    { key: 'pan', label: 'PAN Card' },
    { key: 'aadhaar', label: 'Aadhaar' },
    { key: 'degree', label: 'Degree Certificate' },
    { key: 'tenth', label: '10th Marksheet' },
    { key: 'twelfth', label: '12th Marksheet' },
    { key: 'bank', label: 'Bank Proof' },
  ],
  Contractor: [
    { key: 'pan', label: 'PAN Card' },
    { key: 'aadhaar', label: 'Aadhaar' },
    { key: 'bank', label: 'Bank Proof' },
    { key: 'contract', label: 'Signed Contract' },
  ],
  Intern: [
    { key: 'aadhaar', label: 'Aadhaar' },
    { key: 'college', label: 'College ID' },
    { key: 'bank', label: 'Bank Proof' },
  ],
  'Global Contractor': [
    { key: 'passport', label: 'Passport' },
    { key: 'taxid', label: 'Tax ID' },
    { key: 'bank', label: 'Bank Proof' },
    { key: 'contract', label: 'Signed Contract' },
  ],
  'Global Intern': [
    { key: 'passport', label: 'Passport' },
    { key: 'college', label: 'College ID' },
    { key: 'bank', label: 'Bank Proof' },
  ],
}

/* ---------------- helpers ---------------- */
function genToken() {
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes)
  else for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}
const now = () => new Date().toISOString()
const uid = () => Math.random().toString(36).slice(2, 10)
const plusDays = (d: number) => new Date(Date.now() + d * 864e5).toISOString()

export function docsFor(type: WorkerType): WorkerDoc[] {
  return DOC_TEMPLATES[type].map(d => ({ ...d, status: 'not_uploaded' as DocStatus }))
}

/* ---------------- seed ---------------- */
// Deterministic seed so server and client first render match (no hydration mismatch).
const SEED_DATE = '2026-07-10T09:00:00.000Z'
function seed(): State {
  const mk = (o: Partial<Worker> & { id: string; token: string; firstName: string; lastName: string; type: WorkerType; stage: Stage }): Worker => {
    const name = `${o.firstName} ${o.lastName}`
    const slug = name.toLowerCase().replace(/\s+/g, '.')
    return {
      id: o.id, token: o.token, firstName: o.firstName, lastName: o.lastName, name,
      gender: o.gender || 'Prefer not to say', dob: o.dob, about: o.about,
      personalEmail: o.personalEmail || `${slug}@gmail.com`,
      professionalEmail: o.professionalEmail || `${slug}@katbotz.com`,
      phone: o.phone || '+91 90000 00000',
      country: o.country || 'India', state: o.state || 'Maharashtra', address: o.address || '—',
      pincode: o.pincode || '400001', timezone: o.timezone || TIMEZONES[0],
      type: o.type, employmentType: o.employmentType || (o.type === 'Intern' || o.type === 'Global Intern' ? 'Part-time' : o.type.includes('Contractor') ? 'Contract' : 'Full-time'),
      designation: o.designation || o.type, department: o.department || 'Engineering',
      hrLead: o.hrLead || 'Priya Nair', teamLeads: o.teamLeads || ['Ananya Rao'],
      location: o.location || 'India', status: o.status || 'active',
      dateOfJoining: o.dateOfJoining || SEED_DATE.slice(0, 10), dateOfExit: o.dateOfExit, workExperience: o.workExperience,
      createdAt: SEED_DATE, expiresAt: '2026-07-17T09:00:00.000Z',
      stage: o.stage, accountCreated: o.stage === 'active',
      documents: o.documents || docsFor(o.type), goals: o.goals || [],
      notes: o.notes || [], attendance: o.attendance || [], timeSessions: o.timeSessions || [], projects: o.projects || [],
      reviews: o.reviews || [], feedback: o.feedback || [],
    }
  }
  // doc helpers for seed variety
  const allApproved = (t: WorkerType) => docsFor(t).map(d => ({ ...d, status: 'approved' as DocStatus, fileName: `${d.key}.pdf`, uploadedAt: SEED_DATE }))
  const partial = (t: WorkerType, approvedCount: number) => docsFor(t).map((d, i) => ({
    ...d, status: (i < approvedCount ? 'approved' : 'pending') as DocStatus, fileName: `${d.key}.pdf`, uploadedAt: SEED_DATE,
  }))
  const workers: Worker[] = [
    mk({
      id: 'w-rajesh', token: 'seedrajesh0000000000000000000001',
      firstName: 'Rajesh', lastName: 'Kumar', gender: 'Male', dob: '1994-03-12', about: 'Backend engineer focused on platform reliability.',
      type: 'Employee', stage: 'verifying', department: 'Engineering', designation: 'Senior Developer',
      hrLead: 'Priya Nair', teamLeads: ['Ananya Rao'], workExperience: '5 years', dateOfJoining: '2026-07-01',
      documents: docsFor('Employee').map((d, i) => ({ ...d, status: (i === 0 ? 'approved' : 'pending') as DocStatus, fileName: `${d.key}.pdf`, uploadedAt: SEED_DATE })),
    }),
    mk({
      id: 'w-maya', token: 'seedmaya000000000000000000000002',
      firstName: 'Maya', lastName: 'Patel', gender: 'Female', dob: '1991-08-22', about: 'Product lead driving the onboarding revamp.',
      type: 'Employee', stage: 'active', department: 'Product', designation: 'Product Manager',
      hrLead: 'Priya Nair', teamLeads: ['Ravi Shah', 'Karan Singh'], workExperience: '8 years', dateOfJoining: '2024-01-10',
      documents: docsFor('Employee').map(d => ({ ...d, status: 'approved' as DocStatus, fileName: `${d.key}.pdf`, uploadedAt: SEED_DATE })),
      goals: [
        { id: 'g-maya-1', title: 'Ship onboarding revamp', deadline: '2026-07-17', status: 'in_progress', period: 'weekly' },
        { id: 'g-maya-2', title: 'Finalize Q3 roadmap', deadline: '2026-07-31', status: 'todo', period: 'monthly' },
        { id: 'g-maya-3', title: 'Grow product team to 12', deadline: '2026-12-31', status: 'in_progress', period: 'yearly' },
        { id: 'g-maya-4', title: 'Ship weekly release notes', deadline: '2026-07-10', status: 'completed', period: 'weekly' },
      ],
      notes: [
        { id: 'nt-maya-1', kind: 'todo', text: 'Review PR from Rajesh', done: false, createdAt: SEED_DATE },
        { id: 'nt-maya-2', kind: 'todo', text: 'Prep 1:1 notes for Friday', done: true, createdAt: SEED_DATE },
        { id: 'nt-maya-3', kind: 'note', text: 'Roadmap sync moved to Thursday 4pm', createdAt: SEED_DATE },
      ],
      attendance: [
        { date: '2026-07-06', status: 'present', markedAt: SEED_DATE },
        { date: '2026-07-07', status: 'present', markedAt: SEED_DATE },
        { date: '2026-07-08', status: 'wfh', markedAt: SEED_DATE },
        { date: '2026-07-09', status: 'present', markedAt: SEED_DATE },
        { date: '2026-07-10', status: 'leave', markedAt: SEED_DATE },
      ],
      timeSessions: [
        { id: 'ts-maya-1', date: '2026-07-08', in: '2026-07-08T09:05:00.000Z', out: '2026-07-08T17:30:00.000Z' },
        { id: 'ts-maya-2', date: '2026-07-09', in: '2026-07-09T09:15:00.000Z', out: '2026-07-09T13:00:00.000Z' },
        { id: 'ts-maya-3', date: '2026-07-09', in: '2026-07-09T14:00:00.000Z', out: '2026-07-09T18:10:00.000Z' },
      ],
      projects: [
        { id: 'pr-maya-1', name: 'Onboarding Revamp', lead: 'Ravi Shah', startDate: '2026-06-01', status: 'in_progress' },
      ],
      reviews: [
        { id: 'rv-maya-1', period: '30-day', rating: 4, feedback: 'Strong start — owned the onboarding revamp and shipped ahead of schedule. Could delegate more.', reviewer: 'Ravi Shah', createdAt: '2026-06-10T09:00:00.000Z' },
        { id: 'rv-maya-2', period: '60-day', rating: 5, feedback: 'Consistently high output and great cross-team communication. Ready for more scope.', reviewer: 'Ravi Shah', createdAt: '2026-07-08T09:00:00.000Z' },
      ],
      feedback: [
        { id: 'fb-maya-1', text: 'Discussed Q3 priorities in our 1:1 — aligned on the roadmap and hiring plan.', author: 'Ravi Shah', createdAt: '2026-07-09T09:00:00.000Z' },
        { id: 'fb-maya-2', text: 'Great job unblocking the design handoff this week.', author: 'Karan Singh', createdAt: '2026-07-11T09:00:00.000Z' },
      ],
    }),
    mk({
      id: 'w-john', token: 'seedjohn000000000000000000000003',
      firstName: 'John', lastName: 'Smith', gender: 'Male', dob: '1988-11-02', about: 'Design contractor for the US region.',
      type: 'Global Contractor', stage: 'active', department: 'Design', designation: 'Design Contractor',
      hrLead: 'Priya Nair', teamLeads: ['Ananya Rao'], location: 'US', country: 'United States', state: 'California',
      timezone: TIMEZONES[1], workExperience: '10 years', dateOfJoining: '2023-05-15',
      documents: docsFor('Global Contractor').map(d => ({ ...d, status: 'approved' as DocStatus, fileName: `${d.key}.pdf`, uploadedAt: SEED_DATE })),
    }),
    mk({
      id: 'w-sara', token: 'seedsara000000000000000000000004',
      firstName: 'Sara', lastName: 'Khan', gender: 'Female', dob: '2002-02-18', about: 'Marketing intern.',
      type: 'Intern', stage: 'invited', department: 'Marketing', designation: 'Marketing Intern',
      hrLead: 'Priya Nair', teamLeads: ['Ravi Shah'], workExperience: '0 years', dateOfJoining: '2026-07-14',
    }),

    /* ---- extra demo variety ---- */
    mk({
      id: 'w-arjun', token: 'seedarjun00000000000000000000005',
      firstName: 'Arjun', lastName: 'Mehta', gender: 'Male', dob: '1993-06-30', about: 'Full-stack engineer, ready for account creation.',
      type: 'Employee', stage: 'verified', department: 'Engineering', designation: 'Software Engineer',
      hrLead: 'Priya Nair', teamLeads: ['Ananya Rao'], workExperience: '4 years', dateOfJoining: '2026-07-05',
      documents: allApproved('Employee'),
    }),
    mk({
      id: 'w-neha', token: 'seedneha00000000000000000000006',
      firstName: 'Neha', lastName: 'Gupta', gender: 'Female', dob: '1990-01-14', about: 'Regional sales lead for North India.',
      type: 'Employee', stage: 'active', department: 'Sales', designation: 'Sales Manager',
      hrLead: 'Karan Singh', teamLeads: ['Ravi Shah'], workExperience: '9 years', dateOfJoining: '2022-09-01',
      documents: allApproved('Employee'),
      goals: [
        { id: 'g-neha-1', title: 'Close Q3 enterprise pipeline', deadline: '2026-09-30', status: 'in_progress', period: 'monthly' },
        { id: 'g-neha-2', title: 'Onboard 3 channel partners', deadline: '2026-12-31', status: 'todo', period: 'yearly' },
      ],
      projects: [{ id: 'pr-neha-1', name: 'Enterprise GTM', lead: 'Ravi Shah', startDate: '2026-04-01', status: 'in_progress' }],
      attendance: [
        { date: '2026-07-13', status: 'present', markedAt: SEED_DATE },
        { date: '2026-07-14', status: 'present', markedAt: SEED_DATE },
        { date: '2026-07-15', status: 'wfh', markedAt: SEED_DATE },
      ],
    }),
    mk({
      id: 'w-wei', token: 'seedwei000000000000000000000007',
      firstName: 'Wei', lastName: 'Chen', gender: 'Male', dob: '2001-10-05', about: 'Design intern joining from Singapore.',
      type: 'Global Intern', stage: 'invited', department: 'Design', designation: 'Design Intern',
      hrLead: 'Priya Nair', teamLeads: ['Ananya Rao'], location: 'Other', country: 'Other', state: 'Singapore',
      timezone: TIMEZONES[6], workExperience: '0 years', dateOfJoining: '2026-07-20',
    }),
    mk({
      id: 'w-fatima', token: 'seedfatima0000000000000000000008',
      firstName: 'Fatima', lastName: 'Sheikh', gender: 'Female', dob: '1989-04-19', about: 'HR generalist supporting onboarding.',
      type: 'Employee', stage: 'active', department: 'HR', designation: 'HR Associate',
      hrLead: 'Priya Nair', teamLeads: ['Priya Nair'], workExperience: '7 years', dateOfJoining: '2021-11-20',
      documents: allApproved('Employee'),
      goals: [{ id: 'g-fatima-1', title: 'Roll out attendance policy', deadline: '2026-08-15', status: 'in_progress', period: 'monthly' }],
    }),
    mk({
      id: 'w-carlos', token: 'seedcarlos0000000000000000000009',
      firstName: 'Carlos', lastName: 'Ruiz', gender: 'Male', dob: '1992-12-11', about: 'Growth marketing contractor.',
      type: 'Global Contractor', stage: 'verifying', department: 'Marketing', designation: 'Marketing Contractor',
      hrLead: 'Karan Singh', teamLeads: ['Ravi Shah'], location: 'US', country: 'United States', state: 'Texas',
      timezone: TIMEZONES[3], workExperience: '6 years', dateOfJoining: '2026-07-08',
      documents: partial('Global Contractor', 2),
    }),
    mk({
      id: 'w-ananya-i', token: 'seedananyai000000000000000000010',
      firstName: 'Ananya', lastName: 'Iyer', gender: 'Female', dob: '2000-07-25', about: 'Product intern, converting to full-time.',
      type: 'Intern', stage: 'active', department: 'Product', designation: 'Product Intern',
      hrLead: 'Priya Nair', teamLeads: ['Ravi Shah', 'Karan Singh'], workExperience: '1 year', dateOfJoining: '2026-02-01',
      documents: allApproved('Intern'),
      goals: [
        { id: 'g-ananyai-1', title: 'Ship user research summary', deadline: '2026-07-18', status: 'completed', period: 'weekly' },
        { id: 'g-ananyai-2', title: 'Own the changelog', deadline: '2026-07-31', status: 'in_progress', period: 'monthly' },
      ],
    }),
    mk({
      id: 'w-diego', token: 'seeddiego00000000000000000000011',
      firstName: 'Diego', lastName: 'Alvarez', gender: 'Male', dob: '1995-03-08', about: 'Backend contractor, mid-verification.',
      type: 'Contractor', stage: 'verifying', department: 'Engineering', designation: 'Backend Contractor',
      hrLead: 'Karan Singh', teamLeads: ['Ananya Rao'], workExperience: '5 years', dateOfJoining: '2026-07-09',
      documents: partial('Contractor', 1),
    }),
    mk({
      id: 'w-mei', token: 'seedmei000000000000000000000012',
      firstName: 'Mei', lastName: 'Lin', gender: 'Female', dob: '1991-09-16', about: 'Senior PM, product analytics.',
      type: 'Employee', stage: 'active', department: 'Product', designation: 'Senior Product Manager',
      hrLead: 'Priya Nair', teamLeads: ['Ravi Shah'], workExperience: '11 years', dateOfJoining: '2020-06-15',
      documents: allApproved('Employee'),
      projects: [{ id: 'pr-mei-1', name: 'Analytics 2.0', lead: 'Karan Singh', startDate: '2026-05-10', status: 'in_progress' }],
    }),
    mk({
      id: 'w-tom', token: 'seedtom000000000000000000000013',
      firstName: 'Tom', lastName: 'Baker', gender: 'Male', dob: '1985-05-02', about: 'Former finance analyst (offboarded).',
      type: 'Employee', stage: 'active', department: 'Finance', designation: 'Finance Analyst',
      hrLead: 'Karan Singh', teamLeads: ['Karan Singh'], workExperience: '12 years', dateOfJoining: '2019-03-01',
      status: 'inactive', dateOfExit: '2026-06-30',
      documents: allApproved('Employee'),
    }),
  ]
  const notifications: Notification[] = [
    { id: 'n-1', title: 'Documents submitted', message: 'Rajesh Kumar submitted documents for review.', kind: 'info', read: false, createdAt: SEED_DATE },
    { id: 'n-2', title: 'Ready for account', message: 'All documents verified for Arjun Mehta.', kind: 'success', read: false, createdAt: SEED_DATE },
    { id: 'n-3', title: 'Documents submitted', message: 'Carlos Ruiz submitted documents for review.', kind: 'info', read: false, createdAt: SEED_DATE },
    { id: 'n-4', title: 'Onboarding complete', message: 'Maya Patel is fully onboarded.', kind: 'success', read: true, createdAt: SEED_DATE },
    { id: 'n-5', title: 'Worker offboarded', message: 'Tom Baker was marked inactive (exit 30 Jun).', kind: 'warning', read: true, createdAt: SEED_DATE },
  ]
  const activity: Activity[] = [
    { id: 'a-1', message: 'Carlos Ruiz submitted documents', color: '#162660', createdAt: SEED_DATE },
    { id: 'a-2', message: 'Arjun Mehta fully verified', color: '#10B981', createdAt: SEED_DATE },
    { id: 'a-3', message: 'Neha Gupta assigned to Enterprise GTM', color: '#5B77C4', createdAt: SEED_DATE },
    { id: 'a-4', message: 'Rajesh Kumar submitted documents', color: '#162660', createdAt: SEED_DATE },
    { id: 'a-5', message: 'Maya Patel completed onboarding', color: '#10B981', createdAt: SEED_DATE },
    { id: 'a-6', message: 'Tom Baker marked inactive', color: '#800020', createdAt: SEED_DATE },
  ]
  const leaveRequests: LeaveRequest[] = [
    { id: 'lr-1', workerId: 'w-neha', type: 'Paid Leave', from: '2026-07-24', to: '2026-07-25', days: 2, reason: 'Family function', status: 'pending', createdAt: SEED_DATE },
    { id: 'lr-2', workerId: 'w-ananya-i', type: 'Unpaid Leave', from: '2026-07-21', to: '2026-07-21', days: 1, reason: 'Fever', status: 'pending', createdAt: SEED_DATE },
    { id: 'lr-3', workerId: 'w-maya', type: 'Paid Leave', from: '2026-07-14', to: '2026-07-15', days: 2, reason: 'Short trip', status: 'approved', decidedBy: 'Priya Nair', decidedAt: SEED_DATE, createdAt: SEED_DATE },
  ]
  const holidays: Holiday[] = [
    { id: 'h-1', date: '2026-08-15', name: 'Independence Day' },
    { id: 'h-2', date: '2026-10-02', name: 'Gandhi Jayanti' },
    { id: 'h-3', date: '2026-10-20', name: 'Diwali' },
    { id: 'h-4', date: '2026-12-25', name: 'Christmas' },
  ]
  return { workers, notifications, activity, leaveRequests, holidays }
}

/* ---------------- reducer ---------------- */
interface State { workers: Worker[]; notifications: Notification[]; activity: Activity[]; leaveRequests: LeaveRequest[]; holidays: Holiday[] }

export type NewWorkerInput = Omit<Worker, 'id' | 'token' | 'name' | 'createdAt' | 'expiresAt' | 'stage' | 'accountCreated' | 'documents' | 'goals' | 'notes' | 'attendance' | 'timeSessions' | 'projects' | 'reviews' | 'feedback'>

type Action =
  | { type: 'HYDRATE'; state: State }
  | { type: 'ADD_WORKER'; worker: Worker }
  | { type: 'UPLOAD_DOC'; workerId: string; docKey: string; fileName: string }
  | { type: 'SUBMIT_ALL'; workerId: string }
  | { type: 'VERIFY_DOC'; workerId: string; docKey: string }
  | { type: 'REJECT_DOC'; workerId: string; docKey: string; reason: string }
  | { type: 'CREATE_ACCOUNT'; workerId: string }
  | { type: 'ADD_GOAL'; workerId: string; title: string; deadline?: string; period: GoalPeriod }
  | { type: 'SET_GOAL'; workerId: string; goalId: string; status: Goal['status'] }
  | { type: 'READ_NOTIF'; id: string }
  | { type: 'READ_ALL_NOTIF' }
  | { type: 'ADD_NOTE'; workerId: string; kind: NoteItem['kind']; text: string }
  | { type: 'TOGGLE_NOTE'; workerId: string; noteId: string }
  | { type: 'DELETE_NOTE'; workerId: string; noteId: string }
  | { type: 'MARK_ATTENDANCE'; workerId: string; date: string; status: AttendanceStatus; leaveType?: LeaveType }
  | { type: 'CLOCK_IN'; workerId: string; meta?: PunchMeta }
  | { type: 'CLOCK_OUT'; workerId: string; meta?: PunchMeta }
  | { type: 'ADD_REVIEW'; workerId: string; period: ReviewPeriod; rating: number; feedback: string; reviewer: string }
  | { type: 'ADD_FEEDBACK'; workerId: string; text: string; author: string }
  | { type: 'APPLY_LEAVE'; req: LeaveRequest }
  | { type: 'DECIDE_LEAVE'; id: string; decision: 'approved' | 'rejected'; decidedBy: string }
  | { type: 'ADD_HOLIDAY'; date: string; name: string }
  | { type: 'REMOVE_HOLIDAY'; id: string }
  | { type: 'ASSIGN_PROJECT'; workerId: string; name: string; lead: string; startDate: string }
  | { type: 'SET_PROJECT_STATUS'; workerId: string; projectId: string; status: ProjectStatus }
  | { type: 'SET_EMPLOYEE_STATUS'; workerId: string; status: EmployeeStatus; dateOfExit?: string }
  | { type: 'UPDATE_WORKER'; workerId: string; patch: Partial<Worker> }
  | { type: 'ADD_DOC'; workerId: string; label: string }
  | { type: 'REMOVE_DOC'; workerId: string; docKey: string }

function pushNotif(s: State, n: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification[] {
  return [{ id: uid(), read: false, createdAt: now(), ...n }, ...s.notifications]
}
function pushActivity(s: State, message: string, color: string): Activity[] {
  return [{ id: uid(), message, color, createdAt: now() }, ...s.activity].slice(0, 30)
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return action.state

    case 'ADD_WORKER': {
      const w = action.worker
      return {
        ...state,
        workers: [w, ...state.workers],
        notifications: pushNotif(state, { workerId: w.id, title: 'Onboarding link created', message: `Link generated for ${w.name}.`, kind: 'info' }),
        activity: pushActivity(state, `Onboarding link created for ${w.name}`, '#5B77C4'),
      }
    }

    case 'UPLOAD_DOC': {
      const workers = state.workers.map(w => {
        if (w.id !== action.workerId) return w
        const documents = w.documents.map(d =>
          d.key === action.docKey ? { ...d, fileName: action.fileName, status: 'pending' as DocStatus, reason: undefined, uploadedAt: now() } : d
        )
        return { ...w, documents }
      })
      return { ...state, workers }
    }

    case 'SUBMIT_ALL': {
      const w = state.workers.find(x => x.id === action.workerId)
      const workers = state.workers.map(x => x.id === action.workerId ? { ...x, stage: 'verifying' as Stage } : x)
      return {
        ...state, workers,
        notifications: w ? pushNotif(state, { workerId: w.id, title: 'Documents submitted', message: `${w.name} submitted documents for review.`, kind: 'info' }) : state.notifications,
        activity: w ? pushActivity(state, `${w.name} submitted documents`, '#162660') : state.activity,
      }
    }

    case 'VERIFY_DOC': {
      const before = state.workers.find(w => w.id === action.workerId)
      const workers = state.workers.map(w => {
        if (w.id !== action.workerId) return w
        const documents = w.documents.map(d => d.key === action.docKey ? { ...d, status: 'approved' as DocStatus, reason: undefined } : d)
        const allApproved = documents.every(d => d.status === 'approved')
        return { ...w, documents, stage: allApproved ? ('verified' as Stage) : w.stage }
      })
      const after = workers.find(w => w.id === action.workerId)
      const becameVerified = before?.stage !== 'verified' && after?.stage === 'verified' ? after : null
      let s: State = { ...state, workers }
      if (becameVerified) {
        s = {
          ...s,
          notifications: pushNotif(s, { workerId: becameVerified.id, title: 'Ready for account', message: `All documents verified for ${becameVerified.name}.`, kind: 'success' }),
          activity: pushActivity(s, `${becameVerified.name} fully verified`, '#10B981'),
        }
      }
      return s
    }

    case 'REJECT_DOC': {
      const w = state.workers.find(x => x.id === action.workerId)
      const workers = state.workers.map(x => {
        if (x.id !== action.workerId) return x
        const documents = x.documents.map(d => d.key === action.docKey ? { ...d, status: 'rejected' as DocStatus, reason: action.reason } : d)
        return { ...x, documents }
      })
      const doc = w?.documents.find(d => d.key === action.docKey)
      return {
        ...state, workers,
        notifications: w ? pushNotif(state, { workerId: w.id, title: 'Document rejected', message: `${doc?.label} rejected: ${action.reason}. Please re-upload.`, kind: 'error' }) : state.notifications,
        activity: w ? pushActivity(state, `${doc?.label} rejected for ${w.name}`, '#800020') : state.activity,
      }
    }

    case 'CREATE_ACCOUNT': {
      const w = state.workers.find(x => x.id === action.workerId)
      const workers = state.workers.map(x => x.id === action.workerId ? { ...x, accountCreated: true, stage: 'active' as Stage } : x)
      return {
        ...state, workers,
        notifications: w ? pushNotif(state, { workerId: w.id, title: 'Account created', message: `${w.professionalEmail} is ready. Welcome email sent.`, kind: 'success' }) : state.notifications,
        activity: w ? pushActivity(state, `${w.name} account created`, '#162660') : state.activity,
      }
    }

    case 'ADD_GOAL': {
      const workers = state.workers.map(w => w.id === action.workerId
        ? { ...w, goals: [...w.goals, { id: uid(), title: action.title, deadline: action.deadline, status: 'todo' as Goal['status'], period: action.period }] }
        : w)
      return { ...state, workers }
    }

    case 'SET_GOAL': {
      const workers = state.workers.map(w => w.id === action.workerId
        ? { ...w, goals: w.goals.map(g => g.id === action.goalId ? { ...g, status: action.status } : g) }
        : w)
      return { ...state, workers }
    }

    case 'READ_NOTIF':
      return { ...state, notifications: state.notifications.map(n => n.id === action.id ? { ...n, read: true } : n) }
    case 'READ_ALL_NOTIF':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) }

    case 'ADD_NOTE': {
      const workers = state.workers.map(w => w.id === action.workerId
        ? { ...w, notes: [{ id: uid(), kind: action.kind, text: action.text, done: action.kind === 'todo' ? false : undefined, createdAt: now() }, ...w.notes] }
        : w)
      return { ...state, workers }
    }

    case 'TOGGLE_NOTE': {
      const workers = state.workers.map(w => w.id === action.workerId
        ? { ...w, notes: w.notes.map(n => n.id === action.noteId ? { ...n, done: !n.done } : n) }
        : w)
      return { ...state, workers }
    }

    case 'DELETE_NOTE': {
      const workers = state.workers.map(w => w.id === action.workerId
        ? { ...w, notes: w.notes.filter(n => n.id !== action.noteId) }
        : w)
      return { ...state, workers }
    }

    case 'MARK_ATTENDANCE': {
      const leaveType = action.status === 'leave' ? action.leaveType : undefined
      const workers = state.workers.map(w => {
        if (w.id !== action.workerId) return w
        const existing = w.attendance.find(a => a.date === action.date)
        const attendance = existing
          ? w.attendance.map(a => a.date === action.date ? { ...a, status: action.status, leaveType, markedAt: now() } : a)
          : [...w.attendance, { date: action.date, status: action.status, leaveType, markedAt: now() }]
        return { ...w, attendance }
      })
      return { ...state, workers }
    }

    case 'CLOCK_IN': {
      const workers = state.workers.map(w => {
        if (w.id !== action.workerId) return w
        // ignore if already clocked in (an open session exists)
        if (w.timeSessions.some(s => !s.out)) return w
        return { ...w, timeSessions: [...w.timeSessions, { id: uid(), date: todayStr(), in: now(), inMeta: action.meta }] }
      })
      return { ...state, workers }
    }

    case 'CLOCK_OUT': {
      const workers = state.workers.map(w => {
        if (w.id !== action.workerId) return w
        // close the most recent open session
        const openIdx = [...w.timeSessions].reverse().findIndex(s => !s.out)
        if (openIdx === -1) return w
        const realIdx = w.timeSessions.length - 1 - openIdx
        const timeSessions = w.timeSessions.map((s, i) => i === realIdx ? { ...s, out: now(), outMeta: action.meta } : s)
        return { ...w, timeSessions }
      })
      return { ...state, workers }
    }

    case 'ADD_REVIEW': {
      const w = state.workers.find(x => x.id === action.workerId)
      const workers = state.workers.map(x => x.id === action.workerId
        ? { ...x, reviews: [{ id: uid(), period: action.period, rating: action.rating, feedback: action.feedback, reviewer: action.reviewer, createdAt: now() }, ...x.reviews] }
        : x)
      return {
        ...state, workers,
        notifications: w ? pushNotif(state, { workerId: w.id, title: 'New performance review', message: `${action.reviewer} submitted a ${action.period} review (${action.rating}/5).`, kind: 'info' }) : state.notifications,
        activity: w ? pushActivity(state, `${action.period} review added for ${w.name}`, '#162660') : state.activity,
      }
    }

    case 'ADD_FEEDBACK': {
      const workers = state.workers.map(x => x.id === action.workerId
        ? { ...x, feedback: [{ id: uid(), text: action.text, author: action.author, createdAt: now() }, ...x.feedback] }
        : x)
      return { ...state, workers }
    }

    case 'APPLY_LEAVE': {
      const w = state.workers.find(x => x.id === action.req.workerId)
      return {
        ...state,
        leaveRequests: [action.req, ...state.leaveRequests],
        notifications: w ? pushNotif(state, { workerId: w.id, title: 'Leave request submitted', message: `${w.name} requested ${action.req.days}d ${action.req.type}.`, kind: 'info' }) : state.notifications,
        activity: w ? pushActivity(state, `${w.name} applied for ${action.req.type}`, '#5B77C4') : state.activity,
      }
    }

    case 'DECIDE_LEAVE': {
      const req = state.leaveRequests.find(r => r.id === action.id)
      if (!req || req.status !== 'pending') return state
      const leaveRequests = state.leaveRequests.map(r => r.id === action.id
        ? { ...r, status: action.decision, decidedBy: action.decidedBy, decidedAt: now() } : r)
      let workers = state.workers
      // on approval, auto-mark those weekdays as leave on the attendance calendar
      if (action.decision === 'approved') {
        const dates = businessDaysBetween(req.from, req.to)
        workers = state.workers.map(w => {
          if (w.id !== req.workerId) return w
          let attendance = w.attendance
          for (const d of dates) {
            const exists = attendance.find(a => a.date === d)
            attendance = exists
              ? attendance.map(a => a.date === d ? { ...a, status: 'leave' as AttendanceStatus, leaveType: req.type, markedAt: now() } : a)
              : [...attendance, { date: d, status: 'leave' as AttendanceStatus, leaveType: req.type, markedAt: now() }]
          }
          return { ...w, attendance }
        })
      }
      const w = state.workers.find(x => x.id === req.workerId)
      return {
        ...state, leaveRequests, workers,
        notifications: w ? pushNotif(state, { workerId: w.id, title: `Leave ${action.decision}`, message: `${req.type} (${req.from} → ${req.to}) was ${action.decision} by ${action.decidedBy}.`, kind: action.decision === 'approved' ? 'success' : 'error' }) : state.notifications,
        activity: w ? pushActivity(state, `${w.name}'s ${req.type} ${action.decision}`, action.decision === 'approved' ? '#10B981' : '#800020') : state.activity,
      }
    }

    case 'ADD_HOLIDAY':
      return { ...state, holidays: [...state.holidays, { id: uid(), date: action.date, name: action.name }].sort((a, b) => a.date.localeCompare(b.date)) }
    case 'REMOVE_HOLIDAY':
      return { ...state, holidays: state.holidays.filter(h => h.id !== action.id) }

    case 'ASSIGN_PROJECT': {
      const w = state.workers.find(x => x.id === action.workerId)
      const workers = state.workers.map(x => x.id === action.workerId
        ? { ...x, projects: [...x.projects, { id: uid(), name: action.name, lead: action.lead, startDate: action.startDate, status: 'in_progress' as ProjectStatus }] }
        : x)
      return {
        ...state, workers,
        notifications: w ? pushNotif(state, { workerId: w.id, title: 'Project assigned', message: `${w.name} was assigned to ${action.name}.`, kind: 'info' }) : state.notifications,
        activity: w ? pushActivity(state, `${w.name} assigned to ${action.name}`, '#5B77C4') : state.activity,
      }
    }

    case 'SET_PROJECT_STATUS': {
      const workers = state.workers.map(w => w.id === action.workerId
        ? { ...w, projects: w.projects.map(p => p.id === action.projectId ? { ...p, status: action.status } : p) }
        : w)
      return { ...state, workers }
    }

    case 'SET_EMPLOYEE_STATUS': {
      const w = state.workers.find(x => x.id === action.workerId)
      const workers = state.workers.map(x => x.id === action.workerId
        ? { ...x, status: action.status, dateOfExit: action.status === 'inactive' ? (action.dateOfExit || todayStr()) : undefined }
        : x)
      return {
        ...state, workers,
        activity: w ? pushActivity(state, `${w.name} marked ${action.status}`, action.status === 'active' ? '#10B981' : '#800020') : state.activity,
      }
    }

    case 'UPDATE_WORKER': {
      const workers = state.workers.map(x => {
        if (x.id !== action.workerId) return x
        const merged = { ...x, ...action.patch }
        // Keep the derived display name in sync when either name part changes.
        merged.name = `${merged.firstName} ${merged.lastName}`.trim()
        return merged
      })
      const w = workers.find(x => x.id === action.workerId)
      return {
        ...state, workers,
        activity: w ? pushActivity(state, `${w.name}'s profile updated`, '#5B77C4') : state.activity,
      }
    }

    case 'ADD_DOC': {
      const key = `custom-${uid()}`
      const workers = state.workers.map(x => x.id === action.workerId
        ? { ...x, documents: [...x.documents, { key, label: action.label, status: 'not_uploaded' as DocStatus }] }
        : x)
      return { ...state, workers }
    }

    case 'REMOVE_DOC': {
      const workers = state.workers.map(x => x.id === action.workerId
        ? { ...x, documents: x.documents.filter(d => d.key !== action.docKey) }
        : x)
      return { ...state, workers }
    }

    default:
      return state
  }
}

/* ---------------- context ---------------- */
const KEY = 'wop-store-v2' // bumped: richer seed data (v1 sessions re-seed)
interface Ctx extends State {
  createWorker: (p: NewWorkerInput) => Worker
  uploadDoc: (workerId: string, docKey: string, fileName: string) => void
  submitAll: (workerId: string) => void
  verifyDoc: (workerId: string, docKey: string) => void
  rejectDoc: (workerId: string, docKey: string, reason: string) => void
  createAccount: (workerId: string) => void
  addGoal: (workerId: string, title: string, deadline: string | undefined, period: GoalPeriod) => void
  setGoal: (workerId: string, goalId: string, status: Goal['status']) => void
  readNotif: (id: string) => void
  readAllNotif: () => void
  addNote: (workerId: string, kind: NoteItem['kind'], text: string) => void
  toggleNote: (workerId: string, noteId: string) => void
  deleteNote: (workerId: string, noteId: string) => void
  markAttendance: (workerId: string, date: string, status: AttendanceStatus, leaveType?: LeaveType) => void
  clockIn: (workerId: string, meta?: PunchMeta) => void
  clockOut: (workerId: string, meta?: PunchMeta) => void
  addReview: (workerId: string, period: ReviewPeriod, rating: number, feedback: string, reviewer: string) => void
  addFeedback: (workerId: string, text: string, author: string) => void
  applyLeave: (req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => void
  decideLeave: (id: string, decision: 'approved' | 'rejected', decidedBy: string) => void
  addHoliday: (date: string, name: string) => void
  removeHoliday: (id: string) => void
  assignProject: (workerId: string, name: string, lead: string, startDate: string) => void
  setProjectStatus: (workerId: string, projectId: string, status: ProjectStatus) => void
  setEmployeeStatus: (workerId: string, status: EmployeeStatus, dateOfExit?: string) => void
  updateWorker: (workerId: string, patch: Partial<Worker>) => void
  addDoc: (workerId: string, label: string) => void
  removeDoc: (workerId: string, docKey: string) => void
  workerByToken: (token: string) => Worker | undefined
  workerById: (id: string) => Worker | undefined
}

const WorkforceContext = createContext<Ctx | null>(null)

/* Defensively fill any fields missing from older persisted state so array
   accesses (.map/.filter) never crash after a schema change. */
function normalize(s: unknown): State {
  const st = (s || {}) as { workers?: unknown[]; notifications?: unknown[]; activity?: unknown[] }
  const workers = (st.workers || []).map((raw) => {
    const w = raw as Record<string, unknown>
    return {
      ...w,
      documents: (w.documents as unknown[]) || [],
      goals: (w.goals as unknown[]) || [],
      notes: (w.notes as unknown[]) || [],
      attendance: (w.attendance as unknown[]) || [],
      timeSessions: (w.timeSessions as unknown[]) || [],
      projects: (w.projects as unknown[]) || [],
      reviews: (w.reviews as unknown[]) || [],
      feedback: (w.feedback as unknown[]) || [],
      teamLeads: (w.teamLeads as unknown[]) || (w.teamLead ? [w.teamLead] : []),
      name: (w.name as string) || `${(w.firstName as string) || ''} ${(w.lastName as string) || ''}`.trim(),
    }
  }) as unknown as Worker[]
  return {
    workers,
    notifications: (st.notifications as Notification[]) || [],
    activity: (st.activity as Activity[]) || [],
    leaveRequests: ((st as { leaveRequests?: LeaveRequest[] }).leaveRequests) || [],
    holidays: ((st as { holidays?: Holiday[] }).holidays) || [],
  }
}

export function WorkforceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined as unknown as State, seed)

  // hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) dispatch({ type: 'HYDRATE', state: normalize(JSON.parse(raw)) })
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // persist on change
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  const value: Ctx = {
    ...state,
    createWorker: p => {
      const worker: Worker = {
        ...p,
        name: `${p.firstName} ${p.lastName}`,
        id: uid(), token: genToken(), createdAt: now(), expiresAt: plusDays(7),
        stage: 'invited', accountCreated: false,
        documents: docsFor(p.type), goals: [],
        notes: [], attendance: [], timeSessions: [], projects: [], reviews: [], feedback: [],
      }
      dispatch({ type: 'ADD_WORKER', worker })
      return worker
    },
    uploadDoc: (workerId, docKey, fileName) => dispatch({ type: 'UPLOAD_DOC', workerId, docKey, fileName }),
    submitAll: workerId => dispatch({ type: 'SUBMIT_ALL', workerId }),
    verifyDoc: (workerId, docKey) => dispatch({ type: 'VERIFY_DOC', workerId, docKey }),
    rejectDoc: (workerId, docKey, reason) => dispatch({ type: 'REJECT_DOC', workerId, docKey, reason }),
    createAccount: workerId => dispatch({ type: 'CREATE_ACCOUNT', workerId }),
    addGoal: (workerId, title, deadline, period) => dispatch({ type: 'ADD_GOAL', workerId, title, deadline, period }),
    setGoal: (workerId, goalId, status) => dispatch({ type: 'SET_GOAL', workerId, goalId, status }),
    readNotif: id => dispatch({ type: 'READ_NOTIF', id }),
    readAllNotif: () => dispatch({ type: 'READ_ALL_NOTIF' }),
    addNote: (workerId, kind, text) => dispatch({ type: 'ADD_NOTE', workerId, kind, text }),
    toggleNote: (workerId, noteId) => dispatch({ type: 'TOGGLE_NOTE', workerId, noteId }),
    deleteNote: (workerId, noteId) => dispatch({ type: 'DELETE_NOTE', workerId, noteId }),
    markAttendance: (workerId, date, status, leaveType) => dispatch({ type: 'MARK_ATTENDANCE', workerId, date, status, leaveType }),
    clockIn: (workerId, meta) => dispatch({ type: 'CLOCK_IN', workerId, meta }),
    clockOut: (workerId, meta) => dispatch({ type: 'CLOCK_OUT', workerId, meta }),
    addReview: (workerId, period, rating, feedback, reviewer) => dispatch({ type: 'ADD_REVIEW', workerId, period, rating, feedback, reviewer }),
    addFeedback: (workerId, text, author) => dispatch({ type: 'ADD_FEEDBACK', workerId, text, author }),
    applyLeave: req => dispatch({ type: 'APPLY_LEAVE', req: { ...req, id: uid(), status: 'pending', createdAt: now() } }),
    decideLeave: (id, decision, decidedBy) => dispatch({ type: 'DECIDE_LEAVE', id, decision, decidedBy }),
    addHoliday: (date, name) => dispatch({ type: 'ADD_HOLIDAY', date, name }),
    removeHoliday: id => dispatch({ type: 'REMOVE_HOLIDAY', id }),
    assignProject: (workerId, name, lead, startDate) => dispatch({ type: 'ASSIGN_PROJECT', workerId, name, lead, startDate }),
    setProjectStatus: (workerId, projectId, status) => dispatch({ type: 'SET_PROJECT_STATUS', workerId, projectId, status }),
    setEmployeeStatus: (workerId, status, dateOfExit) => dispatch({ type: 'SET_EMPLOYEE_STATUS', workerId, status, dateOfExit }),
    updateWorker: (workerId, patch) => dispatch({ type: 'UPDATE_WORKER', workerId, patch }),
    addDoc: (workerId, label) => dispatch({ type: 'ADD_DOC', workerId, label }),
    removeDoc: (workerId, docKey) => dispatch({ type: 'REMOVE_DOC', workerId, docKey }),
    workerByToken: token => state.workers.find(w => w.token === token),
    workerById: id => state.workers.find(w => w.id === id),
  }

  return <WorkforceContext.Provider value={value}>{children}</WorkforceContext.Provider>
}

export function useWorkforce() {
  const ctx = useContext(WorkforceContext)
  if (!ctx) throw new Error('useWorkforce must be used within WorkforceProvider')
  return ctx
}

/* Deterministic date formatting (fixed locale + UTC) to avoid SSR/client
   hydration mismatches from differing system locales/timezones. */
export function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })
}
export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

/* stage → label + color for badges */
export const STAGE_META: Record<Stage, { label: string; color: string; bg: string }> = {
  invited: { label: 'Invited', color: '#5B77C4', bg: '#E8EEFB' },
  documents_submitted: { label: 'Submitted', color: '#162660', bg: '#E8EEFB' },
  verifying: { label: 'Verifying', color: '#F59E0B', bg: '#FEF3E2' },
  verified: { label: 'Verified', color: '#10B981', bg: '#E8F6EF' },
  active: { label: 'Active', color: '#0F7A46', bg: '#E8F6EF' },
}

export const GOAL_PERIOD_META: Record<GoalPeriod, { label: string }> = {
  weekly: { label: 'Weekly' },
  monthly: { label: 'Monthly' },
  yearly: { label: 'Yearly' },
}

export const ATTENDANCE_META: Record<AttendanceStatus, { label: string; color: string; bg: string }> = {
  present: { label: 'Present', color: '#0F7A46', bg: '#E8F6EF' },
  wfh: { label: 'WFH', color: '#162660', bg: '#E8EEFB' },
  leave: { label: 'Leave', color: '#B45309', bg: '#FEF3E2' },
  absent: { label: 'Absent', color: '#800020', bg: '#F7E7EA' },
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

/* ---------- Time-tracking helpers ---------- */
/** Total hours worked on a given date (open sessions counted up to `nowMs`). */
export function hoursForDate(sessions: TimeSession[], date: string, nowMs = Date.now()): number {
  const ms = sessions.filter(s => s.date === date).reduce((sum, s) => {
    const start = new Date(s.in).getTime()
    const end = s.out ? new Date(s.out).getTime() : nowMs
    return sum + Math.max(0, end - start)
  }, 0)
  return Math.round((ms / 3_600_000) * 100) / 100
}
/** The currently-open (clocked-in, not out) session for a worker, if any. */
export function openSession(sessions: TimeSession[]): TimeSession | undefined {
  return [...sessions].reverse().find(s => !s.out)
}
export function fmtClock(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
/** Format hours (e.g. 7.5) as "7h 30m". */
export function fmtHours(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/* ---------- Clock-in verification (geofence + anomaly flags) ---------- */
export interface OfficeGeofence { lat: number; lon: number; radiusM: number; label: string }
const OFFICE_DEFAULT: OfficeGeofence = { lat: 26.9124, lon: 75.7873, radiusM: 300, label: 'HQ' }

/** Office geofence config (from Settings in localStorage, else a default). */
export function getOfficeGeofence(): OfficeGeofence {
  try {
    const raw = localStorage.getItem('wop-settings-v1')
    if (raw) {
      const s = JSON.parse(raw)
      if (typeof s.officeLat === 'number' && typeof s.officeLon === 'number') {
        return { lat: s.officeLat, lon: s.officeLon, radiusM: s.officeRadiusM || 300, label: s.companyName || 'Office' }
      }
    }
  } catch { /* ignore */ }
  return OFFICE_DEFAULT
}

function distanceM(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371000, toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(bLat - aLat), dLon = toRad(bLon - aLon)
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

/** Classify a lat/lon against the office geofence. */
export function classifyPlace(lat: number, lon: number): PunchPlace {
  const g = getOfficeGeofence()
  const d = distanceM(lat, lon, g.lat, g.lon)
  if (d <= g.radiusM) return 'In office'
  if (d <= 5000) return 'Remote'        // nearby but outside the office radius → working remotely
  return 'Outside geofence'             // far from office → flag for review
}

/** Capture a punch: HR entries are tagged; self-punches try browser geolocation. */
export function capturePunch(source: 'self' | 'hr'): Promise<PunchMeta> {
  if (source === 'hr') return Promise.resolve({ source: 'hr', place: 'HR-entered' })
  return new Promise(resolve => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return resolve({ source: 'self', place: 'Location off' })
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ source: 'self', place: classifyPlace(pos.coords.latitude, pos.coords.longitude), lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve({ source: 'self', place: 'Location off' }),
      { timeout: 8000, enableHighAccuracy: true }
    )
  })
}

/** Advisory anomaly flags for a session (demo-grade — real enforcement needs a backend). */
export function sessionFlags(s: TimeSession): string[] {
  const flags: string[] = []
  if (s.inMeta?.place === 'Outside geofence') flags.push('Outside office')
  if (s.inMeta?.place === 'Location off') flags.push('No location')
  if (s.inMeta?.source === 'hr') flags.push('HR-entered')
  if (s.out) {
    const hrs = (new Date(s.out).getTime() - new Date(s.in).getTime()) / 3_600_000
    if (hrs > 12) flags.push('Long session (>12h)')
  }
  return flags
}

export const PLACE_META: Record<PunchPlace, { color: string; bg: string }> = {
  'In office': { color: '#0F7A46', bg: '#E8F6EF' },
  Remote: { color: '#162660', bg: '#E8EEFB' },
  'Outside geofence': { color: '#800020', bg: '#F7E7EA' },
  'Location off': { color: '#B45309', bg: '#FEF3E2' },
  'HR-entered': { color: '#64748B', bg: '#F1F5F9' },
}

/* ---------- Leave helpers ---------- */
/** Weekday dates (Mon–Fri) inclusive between two 'YYYY-MM-DD' strings. */
export function businessDaysBetween(from: string, to: string): string[] {
  const out: string[] = []
  const d = new Date(from + 'T00:00:00Z')
  const end = new Date(to + 'T00:00:00Z')
  while (d <= end) {
    const wd = d.getUTCDay()
    if (wd !== 0 && wd !== 6) out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}
export function countBusinessDays(from: string, to: string): number {
  return businessDaysBetween(from, to).length
}
/** Approved days used for a worker + leave type. */
export function leaveTaken(requests: LeaveRequest[], workerId: string, type: LeaveType): number {
  return requests.filter(r => r.workerId === workerId && r.type === type && r.status === 'approved').reduce((s, r) => s + r.days, 0)
}
/** Remaining balance (null = uncapped). */
export function leaveBalance(requests: LeaveRequest[], workerId: string, type: LeaveType): number | null {
  const quota = LEAVE_QUOTAS[type]
  if (quota == null) return null
  return quota - leaveTaken(requests, workerId, type)
}

/** Last N calendar days (oldest -> newest) as 'YYYY-MM-DD', anchored to `today` for determinism. */
export function lastNDays(n: number, today = todayStr()) {
  const base = new Date(today + 'T00:00:00Z')
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(base)
    d.setUTCDate(d.getUTCDate() - (n - 1 - i))
    return d.toISOString().slice(0, 10)
  })
}

export interface Performance {
  attendanceRate: number // % present or wfh, over last 30 marked days
  goalRate: number // % of goals completed
  hoursRate: number // avg daily hours vs an 8h target, capped 100
  reviewRate: number // latest manager review rating as %
  hasReview: boolean
  daysMarked: number
  daysWorked: number
  goalsTotal: number
  avgDailyHours: number
  score: number // weighted overall 0-100 (missing metrics excluded)
}

/* Configurable score weights (sum need not be 100 — normalized at use). */
export interface PerfWeights { reviews: number; goals: number; attendance: number; hours: number }
export const DEFAULT_PERF_WEIGHTS: PerfWeights = { reviews: 35, goals: 30, attendance: 20, hours: 15 }
export function getPerfWeights(): PerfWeights {
  try {
    const raw = localStorage.getItem('wop-settings-v1')
    if (raw) { const s = JSON.parse(raw); if (s.perfWeights) return { ...DEFAULT_PERF_WEIGHTS, ...s.perfWeights } }
  } catch { /* ignore */ }
  return DEFAULT_PERF_WEIGHTS
}

/** Age in whole years from a 'YYYY-MM-DD' date of birth, anchored to `today` for determinism. */
export function ageFromDob(dob: string | undefined, today = todayStr()): number | null {
  if (!dob) return null
  const [by, bm, bd] = dob.split('-').map(Number)
  const [ty, tm, td] = today.split('-').map(Number)
  let age = ty - by
  if (tm < bm || (tm === bm && td < bd)) age--
  return age
}

/** Human-readable "current experience" duration since date of joining. */
export function experienceDuration(dateOfJoining: string, today = todayStr()): string {
  const start = new Date(dateOfJoining + 'T00:00:00Z')
  const end = new Date(today + 'T00:00:00Z')
  let months = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth())
  if (end.getUTCDate() < start.getUTCDate()) months--
  months = Math.max(0, months)
  const years = Math.floor(months / 12)
  const rem = months % 12
  if (years === 0) return `${rem} mo${rem === 1 ? '' : 's'}`
  if (rem === 0) return `${years} yr${years === 1 ? '' : 's'}`
  return `${years} yr${years === 1 ? '' : 's'} ${rem} mo${rem === 1 ? '' : 's'}`
}

/** Weighted scorecard over the last 30 days. Weights (reviews/goals/attendance/
 *  hours) are configurable in Settings. Metrics with no data are excluded and the
 *  remaining weights renormalized, so a worker isn't penalized for a dimension
 *  that simply hasn't been recorded. */
export function computePerformance(w: Worker): Performance {
  const last30 = lastNDays(30)

  // attendance
  const recent = w.attendance.filter(a => last30.includes(a.date))
  const present = recent.filter(a => a.status === 'present' || a.status === 'wfh').length
  const attendanceRate = recent.length ? Math.round((present / recent.length) * 100) : 0

  // goals
  const goalsTotal = w.goals.length
  const goalsDone = w.goals.filter(g => g.status === 'completed').length
  const goalRate = goalsTotal ? Math.round((goalsDone / goalsTotal) * 100) : 0

  // hours (8h/day target)
  const workedDays = last30.filter(d => w.timeSessions.some(s => s.date === d))
  const totalHours = workedDays.reduce((sum, d) => sum + hoursForDate(w.timeSessions, d), 0)
  const avgDailyHours = workedDays.length ? Math.round((totalHours / workedDays.length) * 10) / 10 : 0
  const hoursRate = workedDays.length ? Math.min(100, Math.round((avgDailyHours / 8) * 100)) : 0

  // reviews — most recent manager rating (1–5) as a %
  const hasReview = w.reviews.length > 0
  const reviewRate = hasReview ? Math.round((w.reviews[0].rating / 5) * 100) : 0

  // weighted, renormalized over metrics that have data
  const wt = getPerfWeights()
  const parts: [number, number][] = []
  if (hasReview) parts.push([reviewRate, wt.reviews])
  if (goalsTotal) parts.push([goalRate, wt.goals])
  if (recent.length) parts.push([attendanceRate, wt.attendance])
  if (workedDays.length) parts.push([hoursRate, wt.hours])
  const wsum = parts.reduce((s, [, k]) => s + k, 0)
  const score = wsum ? Math.round(parts.reduce((s, [v, k]) => s + v * k, 0) / wsum) : 0

  return { attendanceRate, goalRate, hoursRate, reviewRate, hasReview, daysMarked: recent.length, daysWorked: workedDays.length, goalsTotal, avgDailyHours, score }
}

/* ---------- Performance trend (recent 7 days vs the prior 7) ---------- */
function shiftYmd(ymd: string, days: number): string {
  const d = new Date(ymd + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10)
}
function windowStat(w: Worker, days: string[]): number | null {
  const marked = days.filter(d => w.attendance.some(a => a.date === d))
  const present = marked.filter(d => { const a = w.attendance.find(x => x.date === d)!; return a.status === 'present' || a.status === 'wfh' }).length
  const attRate = marked.length ? (present / marked.length) * 100 : null
  const worked = days.filter(d => w.timeSessions.some(s => s.date === d))
  const hrs = worked.reduce((s, d) => s + hoursForDate(w.timeSessions, d), 0)
  const hrsRate = worked.length ? Math.min(100, (hrs / worked.length / 8) * 100) : null
  const vals = [attRate, hrsRate].filter((v): v is number => v !== null)
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
}
/** Momentum: (recent 7-day attendance+hours) minus (prior 7-day). Positive = improving. */
export function performanceTrend(w: Worker): number {
  const cur = windowStat(w, lastNDays(7))
  const prev = windowStat(w, lastNDays(7, shiftYmd(todayStr(), -7)))
  if (cur === null || prev === null) return 0
  return Math.round(cur - prev)
}

/* ---------- Employee lifecycle ---------- */
export type LifecycleStage = 'Onboarding' | 'Probation' | 'Active' | 'Exited'
export const LIFECYCLE_META: Record<LifecycleStage, { color: string; bg: string }> = {
  Onboarding: { color: '#B45309', bg: '#FEF3E2' },
  Probation: { color: '#162660', bg: '#E8EEFB' },
  Active: { color: '#0F7A46', bg: '#E8F6EF' },
  Exited: { color: '#800020', bg: '#F7E7EA' },
}
export function lifecycleStage(w: Worker): LifecycleStage {
  if (w.status === 'inactive') return 'Exited'
  if (w.stage !== 'active') return 'Onboarding'
  const probEnd = shiftYmd(w.dateOfJoining, 90)
  return todayStr() < probEnd ? 'Probation' : 'Active'
}

export interface Milestone { label: string; date: string; done: boolean }
/** Upcoming/past lifecycle milestones: probation end, next work anniversary, next review due. */
export function milestones(w: Worker): Milestone[] {
  const today = todayStr()
  const out: Milestone[] = []
  const probEnd = shiftYmd(w.dateOfJoining, 90)
  out.push({ label: 'Probation ends', date: probEnd, done: today >= probEnd })
  // next work anniversary
  const [jy, jm, jd] = w.dateOfJoining.split('-').map(Number)
  let annYear = Number(today.slice(0, 4))
  const annThis = `${annYear}-${String(jm).padStart(2, '0')}-${String(jd).padStart(2, '0')}`
  if (annThis < today) annYear++
  const ann = `${annYear}-${String(jm).padStart(2, '0')}-${String(jd).padStart(2, '0')}`
  const years = annYear - jy
  out.push({ label: `${years}-year work anniversary`, date: ann, done: false })
  // next review due (last review + 90d, else joining + 90d)
  const lastReview = w.reviews[0]?.createdAt?.slice(0, 10) || w.dateOfJoining
  const reviewDue = shiftYmd(lastReview, 90)
  out.push({ label: 'Next review due', date: reviewDue, done: false })
  return out.sort((a, b) => a.date.localeCompare(b.date))
}

export interface JourneyEvent { date: string; label: string; color: string }
/** A per-employee chronological journey derived from existing records (newest first). */
export function journeyEvents(w: Worker, leaveRequests: LeaveRequest[]): JourneyEvent[] {
  const evs: JourneyEvent[] = []
  evs.push({ date: w.dateOfJoining, label: `Joined as ${w.designation}`, color: '#162660' })
  if (w.accountCreated) evs.push({ date: w.createdAt.slice(0, 10), label: 'Onboarding completed · account created', color: '#10B981' })
  w.projects.forEach(p => evs.push({ date: p.startDate, label: `Assigned to ${p.name}`, color: '#5B77C4' }))
  w.reviews.forEach(r => evs.push({ date: r.createdAt.slice(0, 10), label: `${r.period} review · ${r.rating}★ by ${r.reviewer}`, color: '#0F7A46' }))
  w.feedback.forEach(f => evs.push({ date: f.createdAt.slice(0, 10), label: `1:1 note: ${f.text.length > 48 ? f.text.slice(0, 48) + '…' : f.text}`, color: '#64748B' }))
  leaveRequests.filter(r => r.workerId === w.id && r.status === 'approved').forEach(r => evs.push({ date: r.from, label: `${r.type} — ${r.days}d`, color: '#B45309' }))
  if (w.dateOfExit) evs.push({ date: w.dateOfExit, label: 'Marked inactive / exited', color: '#800020' })
  return evs.sort((a, b) => b.date.localeCompare(a.date))
}
