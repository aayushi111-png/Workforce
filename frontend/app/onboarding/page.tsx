'use client'

import { useEffect } from 'react'
import { useWorkforce } from '@/app/lib/workforceStore'
import { useQueryParam } from '@/app/lib/useQueryParam'

export const dynamic = 'force-dynamic'

export default function OnboardingPage() {
  const role = useQueryParam('role')
  const workerId = useQueryParam('worker')
  const { workers } = useWorkforce()

  // Onboarding now lives inside the merged "Onboarding & Documents" page for admins,
  // and on /onboard/[token] for employees — redirect accordingly.
  useEffect(() => {
    if (role === 'employee') {
      const me = workerId ? workers.find(w => w.id === workerId) : null
      window.location.replace(me ? `/onboard/${me.token}` : `/dashboard?role=employee&worker=${workerId || ''}`)
    } else {
      window.location.replace('/documents?role=admin')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, workerId])

  return <div className="min-h-screen flex items-center justify-center bg-brand-off-white text-brand-slate-gray text-sm">Redirecting…</div>
}
