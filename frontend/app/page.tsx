'use client'

import { useState } from 'react'
import { useWorkforce } from '@/app/lib/workforceStore'

/* Cool-toned animated ocean/beach backdrop — self-contained SVG, no external assets. */
function BeachScene() {
  const seg = (x0: number, y: number, a: number) =>
    ` C ${x0 + 240},${y - a} ${x0 + 480},${y + a} ${x0 + 720},${y} C ${x0 + 960},${y - a} ${x0 + 1200},${y + a} ${x0 + 1440},${y}`
  const wave = (y: number, a: number) => `M0,${y}${seg(0, y, a)}${seg(1440, y, a)} L2880,900 L0,900 Z`

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF6FF" />
          <stop offset="55%" stopColor="#D6ECFB" />
          <stop offset="100%" stopColor="#C4E4F3" />
        </linearGradient>
        <radialGradient id="sun" cx="72%" cy="22%" r="28%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#FDF6E3" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FDF6E3" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#sky)" />
      <circle cx="1040" cy="200" r="380" fill="url(#sun)" />
      <circle cx="1040" cy="200" r="70" fill="#FFFFFF" opacity="0.75" />

      <g fill="#FFFFFF" opacity="0.55">
        <g>
          <ellipse cx="260" cy="150" rx="90" ry="26" />
          <ellipse cx="330" cy="140" rx="70" ry="22" />
          <animateTransform attributeName="transform" type="translate" from="-200 0" to="1640 0" dur="60s" repeatCount="indefinite" />
        </g>
        <g opacity="0.7">
          <ellipse cx="700" cy="240" rx="70" ry="20" />
          <ellipse cx="760" cy="232" rx="55" ry="17" />
          <animateTransform attributeName="transform" type="translate" from="-400 0" to="1640 0" dur="85s" repeatCount="indefinite" />
        </g>
      </g>

      <g opacity="0.55" fill="#AEDDEE">
        <path d={wave(560, 24)} />
        <animateTransform attributeName="transform" type="translate" from="0 0" to="-1440 0" dur="16s" repeatCount="indefinite" />
      </g>
      <g opacity="0.7" fill="#77C4DE">
        <path d={wave(610, 32)} />
        <animateTransform attributeName="transform" type="translate" from="-1440 0" to="0 0" dur="12s" repeatCount="indefinite" />
      </g>
      <g opacity="0.85" fill="#3F9FC8">
        <path d={wave(672, 28)} />
        <animateTransform attributeName="transform" type="translate" from="0 0" to="-1440 0" dur="9s" repeatCount="indefinite" />
      </g>
      <g opacity="0.9" fill="#2E7CAE">
        <path d={wave(742, 22)} />
        <animateTransform attributeName="transform" type="translate" from="-1440 0" to="0 0" dur="7s" repeatCount="indefinite" />
      </g>

      <rect y="856" width="1440" height="44" fill="#F3EAD6" opacity="0.5" />
    </svg>
  )
}

export default function LoginPage() {
  const { workers } = useWorkforce()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('employee')
  const [workerId, setWorkerId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (role === 'employee' && !workerId) {
      setError('Select which worker to sign in as')
      return
    }
    try {
      window.location.href = role === 'admin'
        ? '/dashboard?role=admin'
        : `/dashboard?role=employee&worker=${workerId}`
    } catch {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">
      <BeachScene />

      <div className="absolute inset-0 bg-white/10" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        <div className="w-32 mb-5 drop-shadow-sm">
          <img src="/w-logo.png" alt="Workforce" className="w-full h-auto" />
        </div>
        <h1 className="font-wordmark text-4xl font-extrabold tracking-[0.18em] text-brand-royal-blue text-center drop-shadow-sm">
          WORKFORCE
        </h1>
        <p className="font-tagline italic text-lg text-brand-royal-blue/70 text-center mt-1 mb-8">
          Built for Modern Teams
        </p>

        {error && (
          <div className="w-full mb-4 p-3 bg-status-error/10 border border-status-error rounded-lg">
            <p className="text-status-error text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-white/70 shadow-2xl p-8 w-full">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-brand-gray rounded-lg bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal-blue focus:border-transparent"
                placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-brand-gray rounded-lg bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal-blue focus:border-transparent"
                placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-1.5">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)}
                className="w-full px-4 py-2.5 border border-brand-gray rounded-lg bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal-blue focus:border-transparent">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {role === 'employee' && (
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-1.5">Sign in as</label>
                <select value={workerId} onChange={e => setWorkerId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-brand-gray rounded-lg bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal-blue focus:border-transparent">
                  <option value="">Select worker (demo)…</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>{w.name} — {w.type}{w.accountCreated ? '' : ' (onboarding)'}</option>
                  ))}
                </select>
              </div>
            )}
            <button type="submit"
              className="w-full bg-brand-royal-blue text-white py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-brand-royal-blue/20">
              Sign In
            </button>
          </form>

          <div className="mt-5 p-3 bg-brand-off-white/80 rounded-lg text-xs text-brand-slate-gray">
            <p className="font-medium mb-1">Demo Accounts:</p>
            <p>Admin: admin@company.com / admin123</p>
            <p>Employee: employee@company.com / emp123</p>
          </div>
        </div>

        <p className="relative z-10 text-xs text-brand-royal-blue/60 mt-6">Demo mode · No real authentication</p>
      </div>
    </div>
  )
}
