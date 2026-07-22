'use client'

import Link from 'next/link'
import Sidebar from '@/app/layout/Sidebar'
import { useWorkforce, fmtDateTime } from '@/app/lib/workforceStore'
import { useQueryParam } from '@/app/lib/useQueryParam'

export const dynamic = 'force-dynamic'

const KIND: Record<string, { color: string; bg: string }> = {
  info: { color: '#162660', bg: '#E8EEFB' },
  success: { color: '#0F7A46', bg: '#E8F6EF' },
  warning: { color: '#B45309', bg: '#FEF3E2' },
  error: { color: '#800020', bg: '#F7E7EA' },
}

export default function NotificationsPage() {
  const role = useQueryParam('role')
  const workerId = useQueryParam('worker')
  const { notifications, readNotif, readAllNotif } = useWorkforce()
  const list = role === 'employee' ? notifications.filter(n => n.workerId === workerId) : notifications
  const unread = list.filter(n => !n.read).length
  const backHref = role === 'employee' ? `/dashboard?role=employee&worker=${workerId || ''}` : '/dashboard?role=admin'
  const markAllRead = () => {
    if (role === 'employee') list.forEach(n => !n.read && readNotif(n.id))
    else readAllNotif()
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5 flex items-center justify-between">
            <div>
              <Link href={backHref} className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
              <h1 className="text-2xl font-bold text-brand-charcoal mt-1">Notifications {unread > 0 && <span className="text-sm font-medium text-brand-slate-gray">({unread} unread)</span>}</h1>
            </div>
            {unread > 0 && <button onClick={markAllRead} className="btn-ghost text-sm">Mark all read</button>}
          </div>
        </header>

        <main className="px-8 py-7">
          <div className="max-w-2xl space-y-2">
            {list.length === 0 && (
              <div className="bg-white rounded-2xl border border-brand-gray p-10 text-center text-brand-slate-gray">No notifications.</div>
            )}
            {list.map(n => {
              const k = KIND[n.kind] || KIND.info
              return (
                <button key={n.id} onClick={() => readNotif(n.id)}
                  className={`w-full text-left bg-white rounded-xl border p-4 flex gap-3 transition hover:shadow-sm ${n.read ? 'border-brand-gray' : 'border-brand-royal-blue'}`}>
                  <span className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.read ? '#CBD5E1' : k.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-brand-charcoal text-sm">{n.title}</p>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ color: k.color, background: k.bg }}>{n.kind}</span>
                    </div>
                    <p className="text-sm text-brand-slate-gray mt-0.5">{n.message}</p>
                    <p className="text-xs text-brand-slate-gray/70 mt-1">{fmtDateTime(n.createdAt)}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </main>
      </div>
    </>
  )
}
