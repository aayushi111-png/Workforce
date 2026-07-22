'use client'

/**
 * Google Calendar 3-week schedule (last week · this week · next week).
 *
 * DEMO mode by default (sample meetings across the 3 weeks, zero setup, offline).
 * "Connect Google Calendar" switches to REAL in-browser OAuth once you have a
 * Client ID (see setup steps in chat / paste when prompted).
 */

import { useEffect, useMemo, useState } from 'react'

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (cfg: {
            client_id: string
            scope: string
            callback: (resp: { access_token?: string; error?: string }) => void
          }) => { requestAccessToken: () => void }
        }
      }
    }
  }
}

interface CalEvent { id: string; title: string; start: string; end?: string; allDay?: boolean }

const CLIENT_ID_KEY = 'wop-gcal-client-id'
const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly'
const WD_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/* ---- date helpers (local time) ---- */
function mondayOf(d: Date): Date {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // Mon=0 … Sun=6
  x.setDate(x.getDate() - day); x.setHours(0, 0, 0, 0)
  return x
}
function addDays(d: Date, n: number): Date { const x = new Date(d); x.setDate(x.getDate() + n); return x }
function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function fmtTime(iso: string) { return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }

/* Sample meetings spread across last / this / next week, anchored to this week's Monday. */
function makeDemoEvents(): CalEvent[] {
  const mon = mondayOf(new Date())
  const mk = (week: number, wd: number, h: number, m: number, dur: number, title: string): CalEvent => {
    const s = addDays(mon, week * 7 + wd); s.setHours(h, m, 0, 0)
    const e = new Date(s); e.setMinutes(e.getMinutes() + dur)
    return { id: `d-${week}-${wd}-${h}${m}`, title, start: s.toISOString(), end: e.toISOString() }
  }
  return [
    // last week
    mk(-1, 0, 10, 0, 60, 'Sprint Retro'), mk(-1, 2, 15, 0, 30, '1:1 with Ravi Shah'), mk(-1, 4, 11, 0, 45, 'Client Call'),
    // this week
    mk(0, 0, 9, 30, 30, 'Team Standup'), mk(0, 1, 13, 0, 45, 'Onboarding Review'),
    mk(0, 2, 11, 0, 45, '1:1 with Ravi Shah'), mk(0, 3, 15, 0, 60, 'Interview — Backend'), mk(0, 4, 17, 30, 30, 'Design Sync'),
    // next week
    mk(1, 1, 10, 0, 60, 'Quarterly Planning'), mk(1, 3, 14, 0, 30, 'Policy Rollout'), mk(1, 4, 16, 0, 45, 'Town Hall'),
  ]
}

function loadGis(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve()
    const id = 'gis-client-script'
    const existing = document.getElementById(id) as HTMLScriptElement | null
    if (existing) { existing.addEventListener('load', () => resolve()); return }
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.id = id; s.async = true; s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Could not load Google script (offline?)'))
    document.body.appendChild(s)
  })
}

type Status = 'loading' | 'demo' | 'connecting' | 'connected' | 'error'

export function CalendarTimeline({ title = 'Schedule' }: { title?: string }) {
  const [status, setStatus] = useState<Status>('loading')
  const [events, setEvents] = useState<CalEvent[]>([])
  const [error, setError] = useState('')
  const [weekOffset, setWeekOffset] = useState(0) // -1 last, 0 this, 1 next
  const [today, setToday] = useState('')

  const [clientId, setClientId] = useState('')
  const [idInput, setIdInput] = useState('')
  const [editingId, setEditingId] = useState(false)

  useEffect(() => {
    const fromEnv = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const fromLs = typeof localStorage !== 'undefined' ? localStorage.getItem(CLIENT_ID_KEY) : null
    setClientId(fromEnv || fromLs || '')
    setToday(ymd(new Date()))
    setEvents(makeDemoEvents())
    setStatus('demo')
  }, [])

  const saveClientId = () => {
    const v = idInput.trim(); if (!v) return
    localStorage.setItem(CLIENT_ID_KEY, v); setClientId(v); setEditingId(false); setError('')
  }

  const fetchEvents = async (token: string) => {
    const mon = mondayOf(new Date())
    const timeMin = addDays(mon, -7).toISOString()
    const timeMax = addDays(mon, 14).toISOString() // end of next week
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=250`
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!r.ok) throw new Error(r.status === 401 ? 'Session expired — reconnect.' : `Calendar API error (${r.status})`)
    const data = await r.json()
    const evs: CalEvent[] = (data.items || []).map((e: {
      id: string; summary?: string; start?: { dateTime?: string; date?: string }; end?: { dateTime?: string; date?: string }
    }) => {
      const allDay = !e.start?.dateTime
      return {
        id: e.id, title: e.summary || '(no title)', allDay,
        start: (e.start?.dateTime || (e.start?.date ? e.start.date + 'T00:00:00' : '')) as string,
        end: e.end?.dateTime,
      }
    }).filter((e: CalEvent) => e.start)
    setEvents(evs)
  }

  const connect = async () => {
    if (!clientId) { setEditingId(true); setIdInput(''); return }
    setStatus('connecting'); setError('')
    try {
      await loadGis()
      const tokenClient = window.google!.accounts.oauth2.initTokenClient({
        client_id: clientId, scope: SCOPE,
        callback: async resp => {
          if (resp.error || !resp.access_token) { setStatus('demo'); setEvents(makeDemoEvents()); setError('Authorization cancelled — showing demo.'); return }
          try { await fetchEvents(resp.access_token); setStatus('connected') }
          catch (e) { setStatus('error'); setError((e as Error).message) }
        },
      })
      tokenClient.requestAccessToken()
    } catch (e) { setStatus('error'); setError((e as Error).message) }
  }

  const disconnect = () => { setStatus('demo'); setEvents(makeDemoEvents()) }

  const isDemo = status === 'demo'
  const showGrid = status === 'demo' || status === 'connected'

  // days of the selected week + events bucketed by day
  const weekDays = useMemo(() => {
    const mon = addDays(mondayOf(new Date()), weekOffset * 7)
    return Array.from({ length: 7 }, (_, i) => addDays(mon, i))
  }, [weekOffset])
  const byDay = useMemo(() => {
    const map: Record<string, CalEvent[]> = {}
    for (const ev of events) {
      const key = ymd(new Date(ev.start))
      ;(map[key] ||= []).push(ev)
    }
    for (const k in map) map[k].sort((a, b) => (a.allDay ? -1 : 0) - (b.allDay ? -1 : 0) || a.start.localeCompare(b.start))
    return map
  }, [events])
  const weekCount = weekDays.reduce((n, d) => n + (byDay[ymd(d)]?.length || 0), 0)

  const weekLabel = weekOffset === -1 ? 'Last week' : weekOffset === 1 ? 'Next week' : 'This week'

  return (
    <div className="bg-white rounded-2xl border border-brand-gray p-6">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-brand-charcoal">{title}</h2>
          {isDemo
            ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Demo</span>
            : status === 'connected'
              ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-powder-blue text-brand-royal-blue">Google Calendar</span>
              : null}
        </div>
        <div className="flex items-center gap-2">
          {status === 'connected' && <button onClick={() => connect()} className="text-xs font-medium text-brand-royal-blue hover:underline">Refresh</button>}
          {status === 'connected'
            ? <button onClick={disconnect} className="text-xs font-medium text-brand-slate-gray hover:text-brand-burgundy">Disconnect</button>
            : <button onClick={connect} disabled={status === 'connecting'} className="btn-ghost text-sm disabled:opacity-60">
                {status === 'connecting' ? 'Connecting…' : 'Connect Google Calendar'}
              </button>}
        </div>
      </div>

      {/* week tabs */}
      {showGrid && (
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5 bg-brand-off-white p-1 rounded-full">
            {[-1, 0, 1].map(o => (
              <button key={o} onClick={() => setWeekOffset(o)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${weekOffset === o ? 'bg-brand-royal-blue text-white shadow' : 'text-brand-slate-gray hover:text-brand-charcoal'}`}>
                {o === -1 ? 'Last week' : o === 1 ? 'Next week' : 'This week'}
              </button>
            ))}
          </div>
          <p className="text-xs text-brand-slate-gray">
            {weekLabel}: {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {weekCount} meeting{weekCount === 1 ? '' : 's'}
          </p>
        </div>
      )}

      {/* client-id setup */}
      {editingId && (
        <div className="mb-4 p-4 rounded-xl bg-brand-off-white space-y-2">
          <p className="text-sm font-medium text-brand-charcoal">Add your Google OAuth Client ID</p>
          <p className="text-xs text-brand-slate-gray">
            Cloud Console → enable Calendar API → OAuth "Web application" client → add
            <code className="mx-1 px-1 rounded bg-white border border-brand-gray">http://localhost:3000</code> as an origin → paste the Client ID.
          </p>
          <div className="flex gap-2">
            <input value={idInput} onChange={e => setIdInput(e.target.value)} placeholder="xxxxxxxx.apps.googleusercontent.com" className="flex-1 text-sm" />
            <button onClick={saveClientId} className="btn-primary text-sm whitespace-nowrap">Save</button>
            <button onClick={() => setEditingId(false)} className="text-sm px-3 rounded-lg border border-brand-gray text-brand-slate-gray">Cancel</button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="py-6 text-center">
          <p className="text-sm text-brand-burgundy">{error || 'Something went wrong.'}</p>
          <button onClick={disconnect} className="text-xs text-brand-royal-blue hover:underline mt-2">Back to demo</button>
        </div>
      )}
      {error && status !== 'error' && <p className="text-xs text-brand-slate-gray mb-3">{error}</p>}

      {/* week grid */}
      {showGrid && (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 min-w-[640px]">
            {weekDays.map(d => {
              const key = ymd(d)
              const dayEvents = byDay[key] || []
              const isToday = key === today
              const isPast = key < today
              return (
                <div key={key} className={`rounded-xl border p-2 min-h-[120px] ${isToday ? 'border-brand-royal-blue bg-brand-powder-blue/20' : 'border-brand-gray'} ${isPast ? 'opacity-70' : ''}`}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-semibold text-brand-slate-gray">{WD_SHORT[(d.getDay() + 6) % 7]}</span>
                    <span className={`text-sm font-bold ${isToday ? 'text-brand-royal-blue' : 'text-brand-charcoal'}`}>{d.getDate()}</span>
                  </div>
                  <div className="mt-1.5 space-y-1">
                    {dayEvents.map(ev => (
                      <div key={ev.id}
                        title={`${ev.title}${ev.allDay ? ' · All day' : ` · ${fmtTime(ev.start)}${ev.end ? `–${fmtTime(ev.end)}` : ''}`}`}
                        className="text-[10px] leading-tight px-1.5 py-1 rounded bg-brand-royal-blue/10 text-brand-royal-blue truncate">
                        <span className="font-semibold">{ev.allDay ? 'All day' : fmtTime(ev.start)}</span> {ev.title}
                      </div>
                    ))}
                    {dayEvents.length === 0 && <div className="text-[10px] text-brand-slate-gray/60 pt-1">—</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isDemo && showGrid && (
        <p className="text-xs text-brand-slate-gray mt-4 pt-3 border-t border-brand-gray">
          Showing sample meetings across three weeks. Connect Google Calendar to sync your real schedule.
        </p>
      )}
    </div>
  )
}
