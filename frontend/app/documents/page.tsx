'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/app/layout/Sidebar'
import { useWorkforce, STAGE_META, REJECT_REASONS } from '@/app/lib/workforceStore'
import { useQueryParam } from '@/app/lib/useQueryParam'

export const dynamic = 'force-dynamic'

export default function DocumentsPage() {
  const role = useQueryParam('role')
  const workerId = useQueryParam('worker')
  if (role === 'employee') return <MyDocuments workerId={workerId} />
  return <AdminDocuments />
}

function MyDocuments({ workerId }: { workerId: string | null }) {
  const { workers } = useWorkforce()
  const me = workerId ? workers.find(w => w.id === workerId) : undefined
  const approved = me?.documents.filter(d => d.status === 'approved').length || 0

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5">
            <Link href={`/dashboard?role=employee&worker=${workerId || ''}`} className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-brand-charcoal mt-1">My Documents</h1>
          </div>
        </header>

        <main className="px-8 py-7">
          {!me && <div className="bg-white rounded-2xl border border-brand-gray p-10 text-center text-brand-slate-gray">No worker signed in.</div>}
          {me && (
            <div className="max-w-2xl space-y-4">
              <div className="bg-white rounded-2xl border border-brand-gray p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brand-charcoal">{approved}/{me.documents.length} documents verified</p>
                  <p className="text-sm text-brand-slate-gray mt-0.5">{me.accountCreated ? `Account active — ${me.professionalEmail}` : 'HR reviews each upload before your account is created.'}</p>
                </div>
                {!me.accountCreated && (
                  <Link href={`/onboard/${me.token}`} className="btn-primary whitespace-nowrap">Upload / Re-upload</Link>
                )}
              </div>
              <div className="bg-white rounded-2xl border border-brand-gray divide-y divide-brand-gray">
                {me.documents.map(doc => {
                  const done = doc.status === 'approved'
                  const rej = doc.status === 'rejected'
                  const pend = doc.status === 'pending'
                  return (
                    <div key={doc.key} className="p-5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-brand-charcoal">{doc.label}</p>
                        <p className="text-xs text-brand-slate-gray mt-0.5">{doc.status === 'not_uploaded' ? 'Not uploaded yet' : doc.fileName}</p>
                        {rej && <p className="text-xs text-brand-burgundy mt-0.5">Rejected: {doc.reason}</p>}
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{
                        color: done ? '#0F7A46' : rej ? '#800020' : pend ? '#B45309' : '#64748B',
                        background: done ? '#E8F6EF' : rej ? '#F7E7EA' : pend ? '#FEF3E2' : '#F1F5F9',
                      }}>{done ? 'Verified' : rej ? 'Rejected' : pend ? 'Pending' : 'Awaiting'}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

function AdminDocuments() {
  const preselect = useQueryParam('worker')
  const { workers, verifyDoc, rejectDoc, createAccount } = useWorkforce()

  const queue = workers.filter(w => w.documents.some(d => d.status !== 'not_uploaded'))
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = workers.find(w => w.id === selectedId) || null
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [reason, setReason] = useState(REJECT_REASONS[0])
  const [showConfirm, setShowConfirm] = useState(false)

  // Default to the preselected worker (from ?worker=) or the first in queue.
  useEffect(() => {
    setSelectedId(prev => prev || preselect || queue[0]?.id || null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselect, workers.length])

  // Clear doc selection whenever the selected worker changes.
  useEffect(() => { setSelectedDocs([]); setShowConfirm(false) }, [selectedId])

  const rejectableKeys = selected ? selected.documents.filter(d => d.status !== 'not_uploaded' && d.status !== 'approved').map(d => d.key) : []
  const toggleDoc = (key: string) => setSelectedDocs(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  const selectAllRejectable = () => setSelectedDocs(rejectableKeys)
  const clearSelection = () => { setSelectedDocs([]); setShowConfirm(false) }
  const confirmRejection = () => {
    if (!selected) return
    selectedDocs.forEach(key => rejectDoc(selected.id, key, reason))
    clearSelection()
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5">
            <Link href="/dashboard?role=admin" className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-brand-charcoal mt-1">Document Verification</h1>
          </div>
        </header>

        <main className="px-8 py-7">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Queue list */}
            <div className="bg-white rounded-2xl border border-brand-gray p-4 h-fit">
              <h2 className="text-sm font-semibold text-brand-slate-gray px-2 mb-2">Queue ({queue.length})</h2>
              <div className="space-y-1">
                {queue.map(w => {
                  const meta = STAGE_META[w.stage]
                  const approved = w.documents.filter(d => d.status === 'approved').length
                  return (
                    <button key={w.id} onClick={() => setSelectedId(w.id)}
                      className={`w-full text-left px-3 py-3 rounded-xl transition flex items-center justify-between ${selectedId === w.id ? 'bg-brand-powder-blue' : 'hover:bg-brand-off-white'}`}>
                      <div>
                        <p className="font-medium text-brand-charcoal text-sm">{w.name}</p>
                        <p className="text-xs text-brand-slate-gray">{approved}/{w.documents.length} verified</p>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
                    </button>
                  )
                })}
                {queue.length === 0 && <p className="text-sm text-brand-slate-gray px-2 py-6 text-center">No submissions yet.</p>}
              </div>
            </div>

            {/* Detail */}
            <div className="lg:col-span-2 space-y-4">
              {!selected && <div className="bg-white rounded-2xl border border-brand-gray p-10 text-center text-brand-slate-gray">Select a worker to review.</div>}

              {selected && (
                <>
                  <div className="bg-white rounded-2xl border border-brand-gray p-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-brand-charcoal">{selected.name}</h2>
                      <p className="text-sm text-brand-slate-gray">{selected.type} · {selected.department} · {selected.personalEmail}</p>
                    </div>
                    {(() => {
                      const meta = STAGE_META[selected.stage]
                      return <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
                    })()}
                  </div>

                  <div className="bg-white rounded-2xl border border-brand-gray overflow-hidden">
                    <div className="px-5 py-3 border-b border-brand-gray flex items-center justify-between bg-brand-off-white">
                      <span className="text-xs font-medium text-brand-slate-gray">
                        Select documents to reject together{selectedDocs.length > 0 && ` — ${selectedDocs.length} selected`}
                      </span>
                      {rejectableKeys.length > 0 && (
                        <button onClick={selectedDocs.length === rejectableKeys.length ? clearSelection : selectAllRejectable}
                          className="text-xs font-medium text-brand-royal-blue hover:underline">
                          {selectedDocs.length === rejectableKeys.length ? 'Deselect all' : 'Select all'}
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-brand-gray">
                      {selected.documents.map(doc => {
                        const rejectable = doc.status !== 'not_uploaded' && doc.status !== 'approved'
                        const checked = selectedDocs.includes(doc.key)
                        return (
                          <div key={doc.key} className={`p-5 flex items-center gap-4 transition ${checked ? 'bg-brand-powder-blue bg-opacity-20' : ''}`}>
                            <input
                              type="checkbox"
                              disabled={!rejectable}
                              checked={checked}
                              onChange={() => toggleDoc(doc.key)}
                              className="w-4 h-4 rounded border-brand-gray flex-shrink-0 disabled:opacity-30"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-brand-charcoal">{doc.label}</p>
                              <p className="text-xs text-brand-slate-gray mt-0.5">
                                {doc.status === 'not_uploaded' ? 'Not uploaded yet' : doc.fileName}
                              </p>
                              {doc.status === 'rejected' && <p className="text-xs text-brand-burgundy mt-0.5">Rejected: {doc.reason}</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <StatusPill status={doc.status} />
                              {rejectable && (
                                <button onClick={() => verifyDoc(selected.id, doc.key)}
                                  className="text-sm px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition">Verify</button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Bulk rejection action bar */}
                    {selectedDocs.length > 0 && (
                      <div className="px-5 py-4 bg-red-50 border-t border-brand-gray space-y-2">
                        {!showConfirm ? (
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-brand-charcoal">{selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''} selected</span>
                            <div className="flex items-center gap-2">
                              <button onClick={clearSelection} className="text-sm px-3 py-2 rounded-lg border border-brand-gray text-brand-slate-gray">Clear</button>
                              <button onClick={() => setShowConfirm(true)} className="text-sm px-4 py-2 rounded-lg bg-brand-burgundy text-white whitespace-nowrap">Reject Selected</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <select value={reason} onChange={e => setReason(e.target.value)} className="flex-1 min-w-[160px] text-sm">
                              {REJECT_REASONS.map(r => <option key={r}>{r}</option>)}
                            </select>
                            <button onClick={confirmRejection} className="text-sm px-4 py-2 rounded-lg bg-brand-burgundy text-white whitespace-nowrap font-semibold">
                              Confirm Rejection ({selectedDocs.length})
                            </button>
                            <button onClick={() => setShowConfirm(false)} className="text-sm px-3 py-2 rounded-lg border border-brand-gray text-brand-slate-gray">Back</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl border border-brand-gray p-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-brand-charcoal">
                        {selected.accountCreated ? 'Account created' : selected.stage === 'verified' ? 'All documents verified' : 'Verify all documents to create account'}
                      </p>
                      <p className="text-sm text-brand-slate-gray mt-0.5">
                        {selected.accountCreated
                          ? `${selected.professionalEmail} · welcome email sent`
                          : 'Creating the account provisions the @katbotz.com email (₹100/month). Only after every document is verified.'}
                      </p>
                    </div>
                    <button
                      disabled={selected.stage !== 'verified' || selected.accountCreated}
                      onClick={() => createAccount(selected.id)}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                      {selected.accountCreated ? '✓ Created' : 'Create Account'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    not_uploaded: { label: 'Awaiting', color: '#64748B', bg: '#F1F5F9' },
    pending: { label: 'Pending', color: '#B45309', bg: '#FEF3E2' },
    approved: { label: 'Verified', color: '#0F7A46', bg: '#E8F6EF' },
    rejected: { label: 'Rejected', color: '#800020', bg: '#F7E7EA' },
  }
  const m = map[status] || map.not_uploaded
  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: m.color, background: m.bg }}>{m.label}</span>
}
