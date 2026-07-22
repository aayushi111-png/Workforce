'use client'

import { useEffect, useState } from 'react'

/**
 * Reads a query-string param on the client only (in useEffect), avoiding the
 * Next.js `useSearchParams()` CSR-bailout that requires a Suspense boundary
 * during static generation. Returns null on first render, then the value.
 */
export function useQueryParam(key: string): string | null {
  const [value, setValue] = useState<string | null>(null)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setValue(params.get(key))
  }, [key])
  return value
}
