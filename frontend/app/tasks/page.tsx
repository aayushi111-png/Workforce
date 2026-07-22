'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/app/layout/Sidebar'
import { useWorkforce, Goal, GoalPeriod, GOAL_PERIOD_META, fmtDate } from '@/app/lib/workforceStore'
import { useQueryParam } from '@/app/lib/useQueryParam'

export const dynamic = 'force-dynamic'

const STATUS: Record<Goal['status'], { label: string; color: string; bg: string }> = {
  todo: { label: 'To Do', color: '#64748B', bg: '#F1F5F9' },
  in_progress: { label: 'In Progress', color: '#B45309', bg: '#FEF3E2' },
  completed: { label: 'Completed', color: '#0F7A46', bg: '#E8F6EF' },
}
const NEXT: Record<Goal['status'], Goal['status']> = { todo: 'in_progress', in_progress: 'completed', completed: 'todo' }
const PERIODS: GoalPeriod[] = ['weekly', 'monthly', 'yearly']

export default function TasksPage() {
  const role = useQueryParam('role')
  const workerId = useQueryParam('worker')
  if (role === 'employee') return <MyTasks workerId={workerId} />
  return <AdminTasks />
}

function PeriodTabs({ active, onChange, counts }: { active: GoalPeriod | 'all'; onChange: (p: GoalPeriod | 'all') => void; counts: Record<string, number> }) {
  return (
    <div className="flex items-center gap-1.5 bg-brand-off-white p-1 rounded-full w-fit">
      {(['all', ...PERIODS] as const).map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${active === p ? 'bg-brand-royal-blue text-white shadow' : 'text-brand-slate-gray hover:text-brand-charcoal'}`}>
          {p === 'all' ? 'All' : GOAL_PERIOD_META[p].label} {counts[p] ? `· ${counts[p]}` : ''}
        </button>
      ))}
    </div>
  )
}

function GoalRow({ goal, onCycle }: { goal: Goal; onCycle: () => void }) {
  const s = STATUS[goal.status]
  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-brand-gray">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-slate-gray bg-brand-off-white px-1.5 py-0.5 rounded">{GOAL_PERIOD_META[goal.period].label}</span>
          <p className={`text-sm font-medium ${goal.status === 'completed' ? 'line-through text-brand-slate-gray' : 'text-brand-charcoal'}`}>{goal.title}</p>
        </div>
        {goal.deadline && <p className="text-xs text-brand-slate-gray mt-1">Due {fmtDate(goal.deadline)}</p>}
      </div>
      <button onClick={onCycle}
        className="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition hover:opacity-80"
        style={{ color: s.color, background: s.bg }}>
        {s.label} ↻
      </button>
    </div>
  )
}

/* ================= Employee: My Tasks ================= */
function MyTasks({ workerId }: { workerId: string | null }) {
  const { workers, setGoal, addGoal } = useWorkforce()
  const me = workerId ? workers.find(w => w.id === workerId) : undefined
  const [period, setPeriod] = useState<GoalPeriod | 'all'>('all')
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [newPeriod, setNewPeriod] = useState<GoalPeriod>('weekly')

  const counts = { all: me?.goals.length || 0, weekly: 0, monthly: 0, yearly: 0 } as Record<string, number>
  me?.goals.forEach(g => { counts[g.period] = (counts[g.period] || 0) + 1 })
  const shown = me?.goals.filter(g => period === 'all' || g.period === period) || []

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !me) return
    addGoal(me.id, title, deadline || undefined, newPeriod)
    setTitle(''); setDeadline('')
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5">
            <Link href={`/dashboard?role=employee&worker=${workerId || ''}`} className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-brand-charcoal mt-1">My Goals</h1>
          </div>
        </header>

        <main className="px-8 py-7">
          {!me && <div className="bg-white rounded-2xl border border-brand-gray p-10 text-center text-brand-slate-gray">No worker signed in.</div>}
          {me && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
              <div className="bg-white rounded-2xl border border-brand-gray p-6 h-fit">
                <h2 className="text-base font-semibold text-brand-charcoal mb-4">Set a Goal</h2>
                <form onSubmit={add} className="space-y-3">
                  <label className="block">
                    <span className="block text-sm font-medium text-brand-charcoal mb-1.5">Goal</span>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Finish onboarding docs" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-brand-charcoal mb-1.5">Timeframe</span>
                    <select value={newPeriod} onChange={e => setNewPeriod(e.target.value as GoalPeriod)}>
                      {PERIODS.map(p => <option key={p} value={p}>{GOAL_PERIOD_META[p].label}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-brand-charcoal mb-1.5">Deadline</span>
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
                  </label>
                  <button type="submit" className="btn-primary w-full">Add Goal</button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-gray p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <PeriodTabs active={period} onChange={setPeriod} counts={counts} />
                  <span className="text-xs text-brand-slate-gray">{me.goals.filter(g => g.status === 'completed').length}/{me.goals.length} done</span>
                </div>
                {shown.length === 0 && <p className="text-sm text-brand-slate-gray py-8 text-center">No goals here yet.</p>}
                <div className="space-y-2">
                  {shown.map(g => <GoalRow key={g.id} goal={g} onCycle={() => setGoal(me.id, g.id, NEXT[g.status])} />)}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

/* ================= Admin: assign + review ================= */
function AdminTasks() {
  const { workers, addGoal, setGoal } = useWorkforce()
  const eligible = workers.filter(w => w.stage === 'active')
  const [selectedId, setSelectedId] = useState<string>(eligible[0]?.id || '')
  const selected = workers.find(w => w.id === selectedId) || eligible[0] || null
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [newPeriod, setNewPeriod] = useState<GoalPeriod>('weekly')
  const [period, setPeriod] = useState<GoalPeriod | 'all'>('all')

  const allGoals = workers.flatMap(w => w.goals.map(g => ({ ...g, worker: w.name })))
  const completed = allGoals.filter(g => g.status === 'completed').length

  const counts = { all: selected?.goals.length || 0, weekly: 0, monthly: 0, yearly: 0 } as Record<string, number>
  selected?.goals.forEach(g => { counts[g.period] = (counts[g.period] || 0) + 1 })
  const shown = selected?.goals.filter(g => period === 'all' || g.period === period) || []

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !selected) return
    addGoal(selected.id, title, deadline || undefined, newPeriod)
    setTitle(''); setDeadline('')
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5">
            <Link href="/dashboard?role=admin" className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-brand-charcoal mt-1">Tasks &amp; Goals</h1>
          </div>
        </header>

        <main className="px-8 py-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Stat label="Total Goals" value={allGoals.length} color="#162660" />
            <Stat label="In Progress" value={allGoals.filter(g => g.status === 'in_progress').length} color="#F59E0B" />
            <Stat label="Completed" value={completed} color="#10B981" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-brand-gray p-6 h-fit">
              <h2 className="text-base font-semibold text-brand-charcoal mb-4">Assign Goal</h2>
              {eligible.length === 0 ? (
                <p className="text-sm text-brand-slate-gray">No active workers yet. Onboard a worker first.</p>
              ) : (
                <form onSubmit={add} className="space-y-3">
                  <label className="block">
                    <span className="block text-sm font-medium text-brand-charcoal mb-1.5">Worker</span>
                    <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                      {eligible.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-brand-charcoal mb-1.5">Goal</span>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Complete wireframes" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-brand-charcoal mb-1.5">Timeframe</span>
                    <select value={newPeriod} onChange={e => setNewPeriod(e.target.value as GoalPeriod)}>
                      {PERIODS.map(p => <option key={p} value={p}>{GOAL_PERIOD_META[p].label}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-brand-charcoal mb-1.5">Deadline</span>
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
                  </label>
                  <button type="submit" className="btn-primary w-full">Add Goal</button>
                </form>
              )}
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-gray p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-base font-semibold text-brand-charcoal">{selected ? `${selected.name}'s Goals` : 'Goals'}</h2>
                {selected && <span className="text-xs text-brand-slate-gray">{selected.goals.filter(g => g.status === 'completed').length}/{selected.goals.length} done</span>}
              </div>
              {selected && <div className="mb-4"><PeriodTabs active={period} onChange={setPeriod} counts={counts} /></div>}

              {(!selected || shown.length === 0) && (
                <p className="text-sm text-brand-slate-gray py-8 text-center">No goals here yet.</p>
              )}

              <div className="space-y-2">
                {selected && shown.map(g => <GoalRow key={g.id} goal={g} onCycle={() => setGoal(selected.id, g.id, NEXT[g.status])} />)}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-gray p-5">
      <p className="text-sm text-brand-slate-gray">{label}</p>
      <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
    </div>
  )
}
