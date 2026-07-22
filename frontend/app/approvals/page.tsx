'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/app/layout/Sidebar'
import { useWorkforce, LeaveStatus, leaveBalance, fmtDate, fmtDateTime } from '@/app/lib/workforceStore'

export const dynamic = 'force-dynamic'

const HR = 'Priya Nair' // acting approver (demo)

const STATUS_META: Record<LeaveStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#B45309', bg: '#FEF3E2' },
  approved: { label: 'Approved', color: '#0F7A46', bg: '#E8F6EF' },
  rejected: { label: 'Rejected', color: '#800020', bg: '#F7E7EA' },
}

export default function ApprovalsPage() {
  const { workers, leaveRequests, decideLeave } = useWorkforce()
  const [tab, setTab] = useState<'pending' | 'all'>('pending')

  const nameOf = (id: string) => workers.find(w => w.id === id)?.name || 'Unknown'
  const deptOf = (id: string) => workers.find(w => w.id === id)?.department || ''
  const sorted = [...leaveRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const list = tab === 'pending' ? sorted.filter(r => r.status === 'pending') : sorted
  const pendingCount = leaveRequests.filter(r => r.status === 'pending').length

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5">
            <Link href="/dashboard?role=admin" className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-brand-charcoal mt-1">Approvals {pendingCount > 0 && <span className="text-sm font-medium text-brand-slate-gray">({pendingCount} pending)</span>}</h1>
          </div>
        </header>

        <main className="px-8 py-7">
          <div className="max-w-3xl">
            <div className="flex items-center gap-1.5 bg-brand-off-white p-1 rounded-full w-fit mb-5">
              {(['pending', 'all'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${tab === t ? 'bg-brand-royal-blue text-white shadow' : 'text-brand-slate-gray hover:text-brand-charcoal'}`}>
                  {t}{t === 'pending' && pendingCount > 0 ? ` · ${pendingCount}` : ''}
                </button>
              ))}
            </div>

            {list.length === 0 && (
              <div className="bg-white rounded-2xl border border-brand-gray p-10 text-center text-brand-slate-gray">
                {tab === 'pending' ? 'Nothing awaiting approval. All clear.' : 'No leave requests yet.'}
              </div>
            )}

            <div className="space-y-3">
              {list.map(r => {
                const s = STATUS_META[r.status]
                const bal = leaveBalance(leaveRequests, r.workerId, r.type)
                return (
                  <div key={r.id} className="bg-white rounded-2xl border border-brand-gray p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-brand-charcoal">{nameOf(r.workerId)}</p>
                          <span className="text-xs text-brand-slate-gray">{deptOf(r.workerId)}</span>
                        </div>
                        <p className="text-sm text-brand-charcoal mt-1">
                          <span className="font-medium">{r.type}</span> · {r.days} day{r.days === 1 ? '' : 's'} · {fmtDate(r.from)} → {fmtDate(r.to)}
                        </p>
                        {r.reason && <p className="text-sm text-brand-slate-gray mt-0.5">“{r.reason}”</p>}
                        <p className="text-xs text-brand-slate-gray mt-1">
                          Applied {fmtDateTime(r.createdAt)}{bal !== null ? ` · ${bal} day(s) of ${r.type} remaining` : ''}
                        </p>
                        {r.status !== 'pending' && r.decidedBy && (
                          <p className="text-xs text-brand-slate-gray mt-0.5">{s.label} by {r.decidedBy}{r.decidedAt ? ` · ${fmtDateTime(r.decidedAt)}` : ''}</p>
                        )}
                      </div>
                      {r.status === 'pending' ? (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => decideLeave(r.id, 'rejected', HR)} className="text-sm px-3 py-1.5 rounded-lg border border-brand-gray text-brand-burgundy hover:bg-red-50 transition">Reject</button>
                          <button onClick={() => decideLeave(r.id, 'approved', HR)} className="text-sm px-4 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition">Approve</button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
