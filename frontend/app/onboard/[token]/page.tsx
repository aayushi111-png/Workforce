'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useWorkforce, fmtDate } from '@/app/lib/workforceStore'

export const dynamic = 'force-dynamic'

export default function OnboardPage() {
  const params = useParams()
  const token = String(params.token || '')
  const { workerByToken, uploadDoc, submitAll } = useWorkforce()
  const worker = workerByToken(token)
  const [justSubmitted, setJustSubmitted] = useState(false)

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-off-white px-4">
        <div className="bg-white rounded-2xl border border-brand-gray p-10 text-center max-w-md">
          <h1 className="text-xl font-bold text-brand-charcoal">Invalid or expired link</h1>
          <p className="text-brand-slate-gray mt-2 text-sm">This onboarding link is not valid. Please ask HR to generate a new one.</p>
        </div>
      </div>
    )
  }

  const uploaded = worker.documents.filter(d => d.status !== 'not_uploaded').length
  const total = worker.documents.length
  const allUploaded = uploaded === total
  const rejected = worker.documents.filter(d => d.status === 'rejected')
  const isReviewing = worker.stage === 'verifying' || worker.stage === 'verified'
  const isActive = worker.stage === 'active'

  const onPick = (docKey: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    uploadDoc(worker.id, docKey, file ? file.name : `${docKey}.pdf`)
  }

  return (
    <div className="min-h-screen bg-brand-off-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 bg-white rounded-xl border border-brand-gray flex items-center justify-center p-1.5">
            <img src="/w-logo.png" alt="Workforce" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-wordmark font-bold tracking-wide text-brand-royal-blue">WORKFORCE</p>
            <p className="text-xs text-brand-slate-gray">Document Onboarding</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-gray p-8">
          <h1 className="text-2xl font-bold text-brand-charcoal">Welcome, {worker.name.split(' ')[0]}</h1>
          <p className="text-brand-slate-gray mt-1 text-sm">
            You&apos;re joining as <b>{worker.type}</b> in <b>{worker.department}</b>. Upload the documents below — no login needed.
          </p>

          {isActive && (
            <Banner kind="success" title="You're all set!" msg="All documents verified and your account has been created. Check your email to sign in." />
          )}
          {isReviewing && !isActive && (
            <Banner kind="info" title="Submitted — under review" msg="HR is verifying your documents. You'll be notified if anything needs re-uploading." />
          )}
          {rejected.length > 0 && !isActive && (
            <Banner kind="error" title={`${rejected.length} document${rejected.length > 1 ? 's' : ''} need re-upload`} msg={rejected.map(d => `${d.label}: ${d.reason}`).join(' · ')} />
          )}
          {justSubmitted && !isReviewing && (
            <Banner kind="success" title="Documents submitted" msg="Thanks! HR will review shortly." />
          )}

          <div className="mt-6 mb-2 flex justify-between text-sm">
            <span className="text-brand-slate-gray">Progress</span>
            <span className="font-semibold text-brand-charcoal">{uploaded}/{total} uploaded</span>
          </div>
          <div className="w-full bg-brand-off-white rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-brand-royal-blue transition-all" style={{ width: `${(uploaded / total) * 100}%` }} />
          </div>

          <div className="mt-6 divide-y divide-brand-gray">
            {worker.documents.map(doc => {
              const done = doc.status === 'approved'
              const rej = doc.status === 'rejected'
              const pend = doc.status === 'pending'
              return (
                <div key={doc.key} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${done ? 'bg-emerald-500' : rej ? 'bg-brand-burgundy' : pend ? 'bg-amber-500' : 'bg-brand-gray'}`} />
                      <p className="font-medium text-brand-charcoal truncate">{doc.label}</p>
                    </div>
                    {doc.fileName && <p className="text-xs text-brand-slate-gray mt-1 ml-4 truncate">{doc.fileName}</p>}
                    {rej && <p className="text-xs text-brand-burgundy mt-1 ml-4">Rejected: {doc.reason} — please re-upload</p>}
                    {done && <p className="text-xs text-emerald-600 mt-1 ml-4">Verified</p>}
                  </div>
                  {!done && !isActive && (
                    <label className="btn-ghost cursor-pointer whitespace-nowrap text-sm">
                      {doc.status === 'not_uploaded' ? 'Upload' : 'Re-upload'}
                      <input type="file" className="hidden" onChange={onPick(doc.key)} />
                    </label>
                  )}
                  {done && <span className="text-emerald-600 text-sm font-medium whitespace-nowrap">✓ Done</span>}
                </div>
              )
            })}
          </div>

          {!isActive && (
            <button
              disabled={!allUploaded || isReviewing}
              onClick={() => { submitAll(worker.id); setJustSubmitted(true) }}
              className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReviewing ? 'Submitted — awaiting verification' : allUploaded ? 'Submit All Documents' : `Upload all ${total} documents to submit`}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-brand-slate-gray mt-6">
          Link expires {fmtDate(worker.expiresAt)} · Your uploads are private and reviewed by HR only.
        </p>
      </div>
    </div>
  )
}

function Banner({ kind, title, msg }: { kind: 'success' | 'info' | 'error'; title: string; msg: string }) {
  const map = {
    success: { bg: '#E8F6EF', color: '#0F7A46', border: '#10B981' },
    info: { bg: '#E8EEFB', color: '#162660', border: '#5B77C4' },
    error: { bg: '#F7E7EA', color: '#800020', border: '#800020' },
  }[kind]
  return (
    <div className="mt-5 rounded-xl p-4 border-l-4" style={{ background: map.bg, borderColor: map.border }}>
      <p className="font-semibold text-sm" style={{ color: map.color }}>{title}</p>
      <p className="text-xs mt-0.5" style={{ color: map.color }}>{msg}</p>
    </div>
  )
}
