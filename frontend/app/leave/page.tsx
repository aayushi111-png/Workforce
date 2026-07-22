'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/app/layout/Sidebar'
import {
  useWorkforce, LeaveType, LEAVE_TYPES, LEAVE_QUOTAS, LeaveStatus,
  leaveBalance, leaveTaken, countBusinessDays, fmtDate, todayStr,
} from '@/app/lib/workforceStore'
import { useQueryParam } from '@/app/lib/useQueryParam'

export const dynamic = 'force-dynamic'

const STATUS_META: Record<LeaveStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#B45309', bg: '#FEF3E2' },
  approved: { label: 'Approved', color: '#0F7A46', bg: '#E8F6EF' },
  rejected: { label: 'Rejected', color: '#800020', bg: '#F7E7EA' },
}

export default function LeavePage() {
  const role = useQueryParam('role')
  const workerId = useQueryParam('worker')
  if (role === 'employee') return <MyLeave workerId={workerId} />
  return <TeamLeave />
}

/* ================= Employee: balances + apply + history ================= */
function MyLeave({ workerId }: { workerId: string | null }) {
  const { workers, leaveRequests, applyLeave } = useWorkforce()
  const me = workerId ? workers.find(w => w.id === workerId) : undefined
  const today = todayStr()

  const [type, setType] = useState<LeaveType>('Paid Leave')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [reason, setReason] = useState('')
  const [err, setErr] = useState('')

  const myReqs = me ? leaveRequests.filter(r => r.workerId === me.id) : []
  const days = from && to && to >= from ? countBusinessDays(from, to) : 0

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!me || !from || !to) return
    if (to < from) { setErr('End date must be after start date.'); return }
    if (days === 0) { setErr('Selected range has no working days.'); return }
    const bal = leaveBalance(leaveRequests, me.id, type)
    if (bal !== null && days > bal) { setErr(`Only ${bal} day(s) of ${type} left.`); return }
    applyLeave({ workerId: me.id, type, from, to, days, reason: reason.trim() })
    setFrom(''); setTo(''); setReason('')
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5">
            <Link href={`/dashboard?role=employee&worker=${workerId || ''}`} className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-brand-charcoal mt-1">My Leave</h1>
          </div>
        </header>

        <main className="px-8 py-7">
          {!me && <div className="bg-white rounded-2xl border border-brand-gray p-10 text-center text-brand-slate-gray">No worker signed in.</div>}
          {me && (
            <div className="max-w-4xl space-y-6">
              {/* balances */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {LEAVE_TYPES.map(t => {
                  const quota = LEAVE_QUOTAS[t]
                  const used = leaveTaken(leaveRequests, me.id, t)
                  const bal = leaveBalance(leaveRequests, me.id, t)
                  return (
                    <div key={t} className="bg-white rounded-2xl border border-brand-gray p-4">
                      <p className="text-xs text-brand-slate-gray">{t}</p>
                      <p className="text-2xl font-bold text-brand-charcoal mt-1">{bal === null ? '∞' : bal}</p>
                      <p className="text-[11px] text-brand-slate-gray">{quota === null ? 'uncapped' : `of ${quota} · ${used} used`}</p>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* apply form */}
                <div className="bg-white rounded-2xl border border-brand-gray p-6 h-fit">
                  <h2 className="text-base font-semibold text-brand-charcoal mb-4">Apply for Leave</h2>
                  {err && <p className="text-sm text-brand-burgundy mb-3">{err}</p>}
                  <form onSubmit={submit} className="space-y-3">
                    <label className="block">
                      <span className="block text-sm font-medium text-brand-charcoal mb-1.5">Type</span>
                      <select value={type} onChange={e => setType(e.target.value as LeaveType)}>
                        {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-brand-charcoal mb-1.5">From</span>
                      <input type="date" value={from} min={today} onChange={e => setFrom(e.target.value)} required />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-brand-charcoal mb-1.5">To</span>
                      <input type="date" value={to} min={from || today} onChange={e => setTo(e.target.value)} required />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-brand-charcoal mb-1.5">Reason</span>
                      <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} placeholder="Optional" />
                    </label>
                    {days > 0 && <p className="text-xs text-brand-slate-gray">{days} working day{days === 1 ? '' : 's'}</p>}
                    <button type="submit" className="btn-primary w-full">Submit Request</button>
                  </form>
                </div>

                {/* history */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-gray p-6">
                  <h2 className="text-base font-semibold text-brand-charcoal mb-4">My Requests</h2>
                  {myReqs.length === 0 && <p className="text-sm text-brand-slate-gray py-6 text-center">No leave requests yet.</p>}
                  <div className="space-y-2">
                    {myReqs.map(r => {
                      const s = STATUS_META[r.status]
                      return (
                        <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-brand-gray">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-brand-charcoal">{r.type} · {r.days}d</p>
                            <p className="text-xs text-brand-slate-gray">{fmtDate(r.from)} → {fmtDate(r.to)}{r.reason ? ` · ${r.reason}` : ''}</p>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

/* ================= Admin: team leave + holidays ================= */
function TeamLeave() {
  const { workers, leaveRequests, holidays, addHoliday, removeHoliday } = useWorkforce()
  const today = todayStr()
  const [hDate, setHDate] = useState('')
  const [hName, setHName] = useState('')

  const nameOf = (id: string) => workers.find(w => w.id === id)?.name || 'Unknown'
  const approvedUpcoming = leaveRequests
    .filter(r => r.status === 'approved' && r.to >= today)
    .sort((a, b) => a.from.localeCompare(b.from))
  const pendingCount = leaveRequests.filter(r => r.status === 'pending').length

  const addH = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hDate || !hName.trim()) return
    addHoliday(hDate, hName.trim()); setHDate(''); setHName('')
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5 flex items-center justify-between">
            <div>
              <Link href="/dashboard?role=admin" className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
              <h1 className="text-2xl font-bold text-brand-charcoal mt-1">Leave</h1>
            </div>
            {pendingCount > 0 && <Link href="/approvals?role=admin" className="btn-primary text-sm">{pendingCount} pending approval{pendingCount === 1 ? '' : 's'} →</Link>}
          </div>
        </header>

        <main className="px-8 py-7">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* upcoming team leave */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-gray p-6">
              <h2 className="text-base font-semibold text-brand-charcoal mb-4">Upcoming Team Leave</h2>
              {approvedUpcoming.length === 0 && <p className="text-sm text-brand-slate-gray py-6 text-center">No upcoming approved leave.</p>}
              <div className="space-y-2">
                {approvedUpcoming.map(r => (
                  <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-brand-gray">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-brand-charcoal truncate">{nameOf(r.workerId)}</p>
                      <p className="text-xs text-brand-slate-gray">{r.type} · {fmtDate(r.from)} → {fmtDate(r.to)} ({r.days}d)</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-powder-blue text-brand-royal-blue flex-shrink-0">Approved</span>
                  </div>
                ))}
              </div>
            </div>

            {/* holidays */}
            <div className="bg-white rounded-2xl border border-brand-gray p-6 h-fit">
              <h2 className="text-base font-semibold text-brand-charcoal mb-4">Holiday Calendar</h2>
              <div className="space-y-2 mb-4">
                {holidays.length === 0 && <p className="text-sm text-brand-slate-gray">No holidays added.</p>}
                {holidays.map(h => (
                  <div key={h.id} className="flex items-center justify-between gap-2 group">
                    <div>
                      <p className="text-sm text-brand-charcoal">{h.name}</p>
                      <p className="text-xs text-brand-slate-gray">{fmtDate(h.date)}</p>
                    </div>
                    <button onClick={() => removeHoliday(h.id)} className="opacity-0 group-hover:opacity-100 text-brand-slate-gray hover:text-brand-burgundy text-xs transition">Remove</button>
                  </div>
                ))}
              </div>
              <form onSubmit={addH} className="space-y-2 pt-3 border-t border-brand-gray">
                <input value={hName} onChange={e => setHName(e.target.value)} placeholder="Holiday name" className="text-sm" />
                <input type="date" value={hDate} onChange={e => setHDate(e.target.value)} className="text-sm" />
                <button type="submit" className="btn-ghost w-full text-sm">+ Add Holiday</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
