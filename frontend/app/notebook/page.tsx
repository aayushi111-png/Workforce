'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/app/layout/Sidebar'
import { useWorkforce, fmtDateTime } from '@/app/lib/workforceStore'
import { useQueryParam } from '@/app/lib/useQueryParam'

export const dynamic = 'force-dynamic'

export default function NotebookPage() {
  const workerId = useQueryParam('worker')
  const { workers, addNote, toggleNote, deleteNote } = useWorkforce()
  const me = workerId ? workers.find(w => w.id === workerId) : undefined

  const [tab, setTab] = useState<'todo' | 'note'>('todo')
  const [text, setText] = useState('')

  const todos = me?.notes.filter(n => n.kind === 'todo') || []
  const notes = me?.notes.filter(n => n.kind === 'note') || []
  const todosDone = todos.filter(t => t.done).length

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !me) return
    addNote(me.id, tab, text.trim())
    setText('')
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5">
            <Link href={`/dashboard?role=employee&worker=${workerId || ''}`} className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-brand-charcoal mt-1">My Notebook</h1>
            <p className="text-sm text-brand-slate-gray mt-0.5">Private to you — a scratchpad for to-dos and notes.</p>
          </div>
        </header>

        <main className="px-8 py-7">
          {!me && <div className="bg-white rounded-2xl border border-brand-gray p-10 text-center text-brand-slate-gray">No worker signed in.</div>}
          {me && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
              {/* To-dos */}
              <div className="bg-white rounded-2xl border border-brand-gray p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-brand-charcoal">To-dos</h2>
                  <span className="text-xs text-brand-slate-gray">{todosDone}/{todos.length} done</span>
                </div>
                <form onSubmit={(e) => { setTab('todo'); submit(e) }} className="flex gap-2 mb-4">
                  <input
                    value={tab === 'todo' ? text : ''}
                    onChange={e => { setTab('todo'); setText(e.target.value) }}
                    placeholder="Add a to-do…"
                    className="flex-1"
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap">Add</button>
                </form>
                <div className="space-y-1.5">
                  {todos.map(t => (
                    <div key={t.id} className="flex items-center gap-3 group px-1 py-1.5 rounded-lg hover:bg-brand-off-white transition">
                      <button
                        onClick={() => toggleNote(me.id, t.id)}
                        className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition ${t.done ? 'bg-brand-royal-blue border-brand-royal-blue' : 'border-brand-gray'}`}
                      >
                        {t.done && <span className="text-white text-xs">✓</span>}
                      </button>
                      <span className={`flex-1 text-sm ${t.done ? 'line-through text-brand-slate-gray' : 'text-brand-charcoal'}`}>{t.text}</span>
                      <button onClick={() => deleteNote(me.id, t.id)} className="opacity-0 group-hover:opacity-100 text-brand-slate-gray hover:text-brand-burgundy text-xs transition flex-shrink-0">Remove</button>
                    </div>
                  ))}
                  {todos.length === 0 && <p className="text-sm text-brand-slate-gray py-6 text-center">Nothing on your list yet.</p>}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-brand-gray p-6">
                <h2 className="text-base font-semibold text-brand-charcoal mb-4">Notes</h2>
                <form onSubmit={(e) => { setTab('note'); submit(e) }} className="flex gap-2 mb-4">
                  <input
                    value={tab === 'note' ? text : ''}
                    onChange={e => { setTab('note'); setText(e.target.value) }}
                    placeholder="Jot something down…"
                    className="flex-1"
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap">Add</button>
                </form>
                <div className="space-y-2">
                  {notes.map(n => (
                    <div key={n.id} className="group p-3 rounded-xl border border-brand-gray bg-amber-50/40">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-brand-charcoal whitespace-pre-wrap">{n.text}</p>
                        <button onClick={() => deleteNote(me.id, n.id)} className="opacity-0 group-hover:opacity-100 text-brand-slate-gray hover:text-brand-burgundy text-xs transition flex-shrink-0">Remove</button>
                      </div>
                      <p className="text-[11px] text-brand-slate-gray mt-1.5">{fmtDateTime(n.createdAt)}</p>
                    </div>
                  ))}
                  {notes.length === 0 && <p className="text-sm text-brand-slate-gray py-6 text-center">No notes yet.</p>}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
