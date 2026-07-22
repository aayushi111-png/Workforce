'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/app/layout/Sidebar'
import { useWorkforce, Worker } from '@/app/lib/workforceStore'

export const dynamic = 'force-dynamic'

/* ---------- role / seniority classification ---------- */
type Band = 'Lead' | 'Senior' | 'Mid' | 'Junior' | 'Consultant' | 'Intern'

const BAND_META: Record<Band, { color: string; bg: string }> = {
  Lead: { color: '#162660', bg: '#E8EEFB' },
  Senior: { color: '#0F7A46', bg: '#E8F6EF' },
  Mid: { color: '#334155', bg: '#EEF2F7' },
  Junior: { color: '#64748B', bg: '#F1F5F9' },
  Consultant: { color: '#B45309', bg: '#FEF3E2' },
  Intern: { color: '#800020', bg: '#F7E7EA' },
}

function bandOf(w: Worker): Band {
  const d = w.designation.toLowerCase()
  if (w.type.includes('Intern') || d.includes('intern')) return 'Intern'
  if (w.type.includes('Contractor') || d.includes('contractor') || d.includes('consultant')) return 'Consultant'
  if (d.includes('head') || d.includes('lead') || d.includes('manager') || d.includes('director')) return 'Lead'
  if (d.includes('senior') || d.includes('sr.') || d.includes('principal') || d.includes('staff')) return 'Senior'
  if (d.includes('junior') || d.includes('jr.') || d.includes('associate') || d.includes('trainee')) return 'Junior'
  return 'Mid'
}

// Rank for choosing a department lead (higher = more senior).
const BAND_RANK: Record<Band, number> = { Lead: 6, Senior: 5, Consultant: 4, Mid: 3, Junior: 2, Intern: 1 }

function initials(name: string) { return name.split(' ').map(n => n[0]).slice(0, 2).join('') }

export default function OrganizationPage() {
  const { workers } = useWorkforce()
  const active = useMemo(() => workers.filter(w => w.status === 'active'), [workers])
  const [tab, setTab] = useState<'chart' | 'departments' | 'projects'>('chart')

  // Group active workers by department.
  const byDept = useMemo(() => {
    const map = new Map<string, Worker[]>()
    active.forEach(w => {
      const d = w.department || 'Unassigned'
      if (!map.has(d)) map.set(d, [])
      map.get(d)!.push(w)
    })
    return Array.from(map.entries())
      .map(([dept, members]) => {
        // Lead = most senior; tie-break by who is named most in others' teamLeads.
        const nameCount = (n: string) => members.filter(m => m.teamLeads.includes(n)).length
        const lead = [...members].sort((a, b) =>
          (BAND_RANK[bandOf(b)] - BAND_RANK[bandOf(a)]) || (nameCount(b.name) - nameCount(a.name))
        )[0]
        return { dept, members, lead }
      })
      .sort((a, b) => b.members.length - a.members.length)
  }, [active])

  // Collect client projects across everyone (deduped by project name).
  const projects = useMemo(() => {
    const map = new Map<string, { name: string; lead: string; status: string; people: Worker[] }>()
    active.forEach(w => w.projects.forEach(p => {
      const cur = map.get(p.name) || { name: p.name, lead: p.lead, status: p.status, people: [] }
      cur.people.push(w)
      if (p.lead) cur.lead = p.lead
      map.set(p.name, cur)
    }))
    return Array.from(map.values()).sort((a, b) => b.people.length - a.people.length)
  }, [active])

  const totalDepts = byDept.length
  const totalConsultants = active.filter(w => bandOf(w) === 'Consultant').length
  const totalInterns = active.filter(w => bandOf(w) === 'Intern').length

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5">
            <Link href="/dashboard?role=admin" className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-brand-charcoal mt-1">Organization</h1>
          </div>
        </header>

        <main className="px-8 py-7 max-w-5xl">
          {/* summary strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Stat label="People" value={active.length} />
            <Stat label="Departments" value={totalDepts} />
            <Stat label="Consultants" value={totalConsultants} />
            <Stat label="Interns" value={totalInterns} />
          </div>

          {/* tabs */}
          <div className="flex items-center gap-1.5 bg-brand-off-white p-1 rounded-full w-fit mb-6 border border-brand-gray">
            {(['chart', 'departments', 'projects'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${tab === t ? 'bg-brand-royal-blue text-white shadow' : 'text-brand-slate-gray hover:text-brand-charcoal'}`}>
                {t === 'chart' ? 'Org Chart' : t === 'departments' ? 'Departments & People' : 'Client Projects'}
              </button>
            ))}
          </div>

          {/* legend */}
          <div className="flex flex-wrap gap-2 mb-5">
            {(Object.keys(BAND_META) as Band[]).map(b => (
              <span key={b} className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: BAND_META[b].color, background: BAND_META[b].bg }}>{b}</span>
            ))}
          </div>

          {tab === 'chart' ? (
            <OrgChart byDept={byDept} total={active.length} />
          ) : tab === 'departments' ? (
            <div className="space-y-5">
              {byDept.map(({ dept, members, lead }) => {
                const grouped = groupByBand(members)
                return (
                  <div key={dept} className="bg-white rounded-2xl border border-brand-gray overflow-hidden">
                    <div className="px-6 py-4 border-b border-brand-gray flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <h2 className="text-lg font-bold text-brand-charcoal">{dept}</h2>
                        <p className="text-sm text-brand-slate-gray">{members.length} {members.length === 1 ? 'person' : 'people'}</p>
                      </div>
                      {lead && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-brand-slate-gray">Led by</span>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-off-white">
                            <div className="w-7 h-7 rounded-full bg-brand-royal-blue text-white flex items-center justify-center text-[11px] font-bold">{initials(lead.name)}</div>
                            <div className="leading-tight">
                              <p className="text-sm font-semibold text-brand-charcoal">{lead.name}</p>
                              <p className="text-[11px] text-brand-slate-gray">{lead.designation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 space-y-4">
                      {(Object.keys(BAND_META) as Band[]).filter(b => grouped[b]?.length).map(b => (
                        <div key={b}>
                          <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: BAND_META[b].color }}>{b} · {grouped[b].length}</p>
                          <div className="flex flex-wrap gap-2">
                            {grouped[b].map(m => <PersonChip key={m.id} w={m} isLead={m.id === lead?.id} />)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.length === 0 && (
                <div className="md:col-span-2 bg-white rounded-2xl border border-brand-gray p-10 text-center text-brand-slate-gray">No client projects assigned yet.</div>
              )}
              {projects.map(p => (
                <div key={p.name} className="bg-white rounded-2xl border border-brand-gray p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold text-brand-charcoal">{p.name}</h2>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-off-white text-brand-charcoal capitalize flex-shrink-0">{p.status.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm text-brand-slate-gray mt-1">Lead: <span className="font-medium text-brand-charcoal">{p.lead || '—'}</span></p>
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-slate-gray mb-2">Team · {p.people.length}</p>
                    <div className="flex flex-wrap gap-2">
                      {p.people.map(m => <PersonChip key={m.id} w={m} isLead={m.name === p.lead} />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}

function groupByBand(members: Worker[]): Record<Band, Worker[]> {
  const out = {} as Record<Band, Worker[]>
  members.forEach(m => {
    const b = bandOf(m)
    ;(out[b] ||= []).push(m)
  })
  return out
}

/* ---------- hierarchical org chart ---------- */
type DeptNode = { dept: string; members: Worker[]; lead: Worker }

function OrgChart({ byDept, total }: { byDept: DeptNode[]; total: number }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  // Center the (horizontally centered) root node in view on mount.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
  }, [byDept.length])
  return (
    <div ref={scrollRef} className="overflow-x-auto pb-6">
      <div className="tree inline-block min-w-full text-center px-4">
        <ul>
          <li>
            {/* company root */}
            <div className="node relative inline-block pt-8 align-top">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 w-16 h-16 rounded-full bg-brand-royal-blue text-white flex items-center justify-center text-lg font-bold shadow-md ring-4 ring-white">K</div>
              <div className="w-48 rounded-2xl px-4 pt-10 pb-3 text-center shadow bg-brand-royal-blue text-white">
                <p className="text-sm font-bold leading-tight">Katbotz</p>
                <p className="text-[11px] text-white/70 leading-tight mt-0.5">{total} people · {byDept.length} departments</p>
              </div>
            </div>
            <ul>
              {byDept.map(({ dept, members, lead }) => {
                const reports = members.filter(m => m.id !== lead?.id)
                return (
                  <li key={dept}>
                    <PersonNode w={lead} variant="lead" deptLabel={dept} />
                    {reports.length > 0 && (
                      <ul>
                        {reports.map(m => (
                          <li key={m.id}><PersonNode w={m} variant="report" /></li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </div>

      <style jsx>{`
        .tree ul { position: relative; padding-top: 28px; display: flex; justify-content: center; gap: 0; }
        .tree li { list-style: none; position: relative; padding: 28px 10px 0; }
        .tree li::before, .tree li::after {
          content: ''; position: absolute; top: 0; right: 50%;
          border-top: 1px solid #C7D0E0; width: 50%; height: 28px;
        }
        .tree li::after { right: auto; left: 50%; border-left: 1px solid #C7D0E0; }
        .tree li:only-child::after, .tree li:only-child::before { display: none; }
        .tree li:only-child { padding-top: 28px; }
        .tree li:first-child::before, .tree li:last-child::after { border: 0 none; }
        .tree li:last-child::before { border-right: 1px solid #C7D0E0; border-radius: 0 6px 0 0; }
        .tree li:first-child::after { border-radius: 6px 0 0 0; }
        .tree ul ul::before {
          content: ''; position: absolute; top: 0; left: 50%;
          border-left: 1px solid #C7D0E0; width: 0; height: 28px;
        }
        .tree > ul { padding-top: 0; }
        .tree > ul > li { padding-top: 0; }
      `}</style>
    </div>
  )
}

function PersonNode({ w, variant, deptLabel }: { w: Worker; variant: 'lead' | 'report'; deptLabel?: string }) {
  const filled = variant === 'lead'
  const band = bandOf(w)
  return (
    <Link href={`/employees?role=admin&worker=${w.id}`} className="node relative inline-block pt-7 align-top group">
      {/* avatar */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold shadow-md ring-4 ring-white transition group-hover:ring-brand-powder-blue"
        style={filled ? { background: '#162660', color: '#fff' } : { background: BAND_META[band].bg, color: BAND_META[band].color }}>
        {initials(w.name)}
      </div>
      <div className={`w-40 rounded-2xl px-3 pt-9 pb-3 text-center shadow-sm transition group-hover:shadow-md ${filled ? 'bg-brand-royal-blue text-white' : 'bg-white border border-brand-gray text-brand-charcoal'}`}>
        <p className="text-sm font-bold leading-tight truncate">{w.name}</p>
        <p className={`text-[11px] leading-tight truncate ${filled ? 'text-white/75' : 'text-brand-slate-gray'}`}>{w.designation}</p>
        {deptLabel && <p className={`text-[10px] mt-1.5 font-semibold uppercase tracking-wide ${filled ? 'text-white/60' : 'text-brand-slate-gray'}`}>{deptLabel}</p>}
      </div>
    </Link>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-gray p-4">
      <p className="text-2xl font-bold text-brand-charcoal">{value}</p>
      <p className="text-xs text-brand-slate-gray">{label}</p>
    </div>
  )
}

function PersonChip({ w, isLead }: { w: Worker; isLead?: boolean }) {
  const b = bandOf(w)
  return (
    <Link href={`/employees?role=admin&worker=${w.id}`}
      className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-brand-gray hover:border-brand-royal-blue hover:shadow-sm transition bg-white">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ color: BAND_META[b].color, background: BAND_META[b].bg }}>{initials(w.name)}</div>
      <div className="leading-tight">
        <p className="text-sm font-medium text-brand-charcoal flex items-center gap-1">{w.name}{isLead && <span className="text-[10px]">★</span>}</p>
        <p className="text-[11px] text-brand-slate-gray">{w.designation}</p>
      </div>
    </Link>
  )
}
