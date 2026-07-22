'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/app/layout/Sidebar'

export const dynamic = 'force-dynamic'

const KEY = 'wop-settings-v1'
const DEFAULTS = {
  companyName: 'Katbotz',
  domain: 'katbotz.com',
  hrEmail: 'hr@katbotz.com',
  linkExpiryDays: 7,
  monthlyCost: 100,
  requireVerificationFirst: true,
  notifyOnSubmit: true,
  notifyOnReject: true,
  notifyOnComplete: true,
  officeLat: 26.9124,
  officeLon: 75.7873,
  officeRadiusM: 300,
  perfWeights: { reviews: 35, goals: 30, attendance: 20, hours: 15 },
}
type Settings = typeof DEFAULTS

export default function SettingsPage() {
  const [s, setS] = useState<Settings>(DEFAULTS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...DEFAULTS, ...JSON.parse(raw) }) } catch {}
  }, [])

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem(KEY, JSON.stringify(s))
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS(prev => ({ ...prev, [k]: v }))

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-brand-off-white with-sidebar">
        <header className="bg-white border-b border-brand-gray sticky top-0 z-10">
          <div className="px-8 py-5">
            <Link href="/dashboard?role=admin" className="text-brand-slate-gray hover:text-brand-royal-blue text-sm">← Dashboard</Link>
            <h1 className="text-2xl font-bold text-brand-charcoal mt-1">Settings</h1>
          </div>
        </header>

        <main className="px-8 py-7">
          <form onSubmit={save} className="max-w-2xl space-y-6">
            <Section title="Company">
              <Grid>
                <Field label="Company Name"><input value={s.companyName} onChange={e => set('companyName', e.target.value)} /></Field>
                <Field label="Email Domain"><input value={s.domain} onChange={e => set('domain', e.target.value)} /></Field>
                <Field label="HR Email"><input type="email" value={s.hrEmail} onChange={e => set('hrEmail', e.target.value)} /></Field>
              </Grid>
            </Section>

            <Section title="Onboarding">
              <Grid>
                <Field label="Link Expiry (days)"><input type="number" min={1} value={s.linkExpiryDays} onChange={e => set('linkExpiryDays', Number(e.target.value))} /></Field>
                <Field label="Account Cost (₹/month)"><input type="number" min={0} value={s.monthlyCost} onChange={e => set('monthlyCost', Number(e.target.value))} /></Field>
              </Grid>
              <Toggle label="Verification-first (verify documents before creating account)" checked={s.requireVerificationFirst} onChange={v => set('requireVerificationFirst', v)} />
            </Section>

            <Section title="Office Geofence (attendance verification)">
              <Grid>
                <Field label="Office Latitude"><input type="number" step="0.0001" value={s.officeLat} onChange={e => set('officeLat', Number(e.target.value))} /></Field>
                <Field label="Office Longitude"><input type="number" step="0.0001" value={s.officeLon} onChange={e => set('officeLon', Number(e.target.value))} /></Field>
                <Field label="Radius (meters)"><input type="number" min={50} value={s.officeRadiusM} onChange={e => set('officeRadiusM', Number(e.target.value))} /></Field>
              </Grid>
              <p className="text-xs text-brand-slate-gray">A clock-in within this radius is tagged "In office"; further away is "Remote"; far off is flagged "Outside geofence" for HR review. Advisory only — true enforcement needs a server-side check.</p>
            </Section>

            <Section title="Performance Score Weights">
              <Grid>
                <Field label="Reviews (%)"><input type="number" min={0} max={100} value={s.perfWeights.reviews} onChange={e => set('perfWeights', { ...s.perfWeights, reviews: Number(e.target.value) })} /></Field>
                <Field label="Goals (%)"><input type="number" min={0} max={100} value={s.perfWeights.goals} onChange={e => set('perfWeights', { ...s.perfWeights, goals: Number(e.target.value) })} /></Field>
                <Field label="Attendance (%)"><input type="number" min={0} max={100} value={s.perfWeights.attendance} onChange={e => set('perfWeights', { ...s.perfWeights, attendance: Number(e.target.value) })} /></Field>
                <Field label="Hours (%)"><input type="number" min={0} max={100} value={s.perfWeights.hours} onChange={e => set('perfWeights', { ...s.perfWeights, hours: Number(e.target.value) })} /></Field>
              </Grid>
              <p className="text-xs text-brand-slate-gray">
                How the 0–100 performance score is weighted (total {s.perfWeights.reviews + s.perfWeights.goals + s.perfWeights.attendance + s.perfWeights.hours}%; they’re auto-normalized). Any dimension with no data is excluded and the rest re-weighted.
              </p>
            </Section>

            <Section title="HR Notifications">
              <Toggle label="Notify when a worker submits documents" checked={s.notifyOnSubmit} onChange={v => set('notifyOnSubmit', v)} />
              <Toggle label="Notify when a document is rejected" checked={s.notifyOnReject} onChange={v => set('notifyOnReject', v)} />
              <Toggle label="Notify when onboarding completes" checked={s.notifyOnComplete} onChange={v => set('notifyOnComplete', v)} />
            </Section>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn-primary">Save Settings</button>
              {saved && <span className="text-sm text-emerald-600 font-medium">Saved ✓</span>}
            </div>
          </form>
        </main>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-gray p-6">
      <h2 className="text-base font-semibold text-brand-charcoal mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-sm font-medium text-brand-charcoal mb-1.5">{label}</span>{children}</label>
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="w-full flex items-center justify-between gap-4 text-left">
      <span className="text-sm text-brand-charcoal">{label}</span>
      <span className={`relative w-11 h-6 rounded-full transition flex-shrink-0 ${checked ? 'bg-brand-royal-blue' : 'bg-brand-gray'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  )
}
