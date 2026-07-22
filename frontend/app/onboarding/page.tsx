'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import Sidebar from '@/app/layout/Sidebar'
import { useWorkforce, STAGE_META, Stage } from '@/app/lib/workforceStore'
import { useQueryParam } from '@/app/lib/useQueryParam'

export const dynamic = 'force-dynamic'

const COLUMNS: { stage: Stage; title: string }[] = [
  { stage: 'invited', title: 'Invited' },
  { stage: 'verifying', title: 'Verifying' },
  { stage: 'verified', title: 'Ready for Account' },
  { stage: 'active', title: 'Onboarded' },
]

export default function OnboardingPage() {
  const role = useQueryParam('role')
  const workerId = useQueryParam('worker')
  const { workers } = useWorkforce()

  // Employees have their own onboarding checklist on /onboard/[token] — send them there.
  useEffect(() => {
    if (role === 'employee') {
      const me = workerId ? workers.find(w => w.id === workerId) : null
      window.location.replace(me ? `/onboard/${me.token}` : `/dashboard?role=employee&worker=${workerId || ''}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, workerId])

  if (role === 'employee') {
    return <div className="min-h-screen flex items-center justify-center bg-brand-off-white text-brand-slate-gray text-sm">Redirecting…</div>
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5 flex items-center justify-between">
            <div>
              <Link href="/dashboard?role=admin" className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
              <h1 className="text-2xl font-bold text-brand-charcoal mt-1">Onboarding Pipeline</h1>
            </div>
            <Link href="/employees?role=admin" className="btn-primary">+ Create Worker</Link>
          </div>
        </header>

        <main className="px-8 py-7">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch min-h-[calc(100vh-160px)]">
            {COLUMNS.map(col => {
              const items = workers.filter(w => w.stage === col.stage)
              const meta = STAGE_META[col.stage]
              return (
                <div key={col.stage} className="bg-white rounded-2xl border border-brand-gray p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-sm font-semibold text-brand-charcoal">{col.title}</h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: meta.color, background: meta.bg }}>{items.length}</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    {items.map(w => {
                      const approved = w.documents.filter(d => d.status === 'approved').length
                      return (
                        <Link key={w.id} href={`/documents?role=admin&worker=${w.id}`}
                          className="block p-3 rounded-xl border border-brand-gray hover:shadow-md hover:-translate-y-0.5 transition-all">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-powder-blue text-brand-royal-blue flex items-center justify-center text-xs font-semibold">
                              {w.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-brand-charcoal truncate">{w.name}</p>
                              <p className="text-xs text-brand-slate-gray truncate">{w.type} · {w.department}</p>
                            </div>
                          </div>
                          <div className="mt-2.5">
                            <div className="w-full bg-brand-off-white rounded-full h-1.5 overflow-hidden">
                              <div className="h-full rounded-full bg-brand-royal-blue" style={{ width: `${(approved / w.documents.length) * 100}%` }} />
                            </div>
                            <p className="text-[11px] text-brand-slate-gray mt-1">{approved}/{w.documents.length} docs verified</p>
                          </div>
                        </Link>
                      )
                    })}
                    {items.length === 0 && <p className="text-xs text-brand-slate-gray px-1 py-4 text-center">Empty</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </>
  )
}
