'use client'

import { useState } from 'react'

/* ---------- Interactive exploded donut (gapped slices, leader-line % labels) ---------- */
export function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const [active, setActive] = useState<number | null>(null)
  const total = data.reduce((s, d) => s + d.value, 0)
  const cx = 80, cy = 80, rOuter = 58, rInner = 30, gap = 3 // degrees between slices
  const rad = (a: number) => (a * Math.PI) / 180
  const pt = (r: number, a: number, ox = 0, oy = 0) => [ox + cx + r * Math.cos(rad(a)), oy + cy + r * Math.sin(rad(a))]

  const ringSeg = (startAngle: number, endAngle: number, pulled: boolean) => {
    const mid = (startAngle + endAngle) / 2
    const ox = pulled ? Math.cos(rad(mid)) * 7 : 0
    const oy = pulled ? Math.sin(rad(mid)) * 7 : 0
    const ro = pulled ? rOuter + 4 : rOuter
    const large = endAngle - startAngle > 180 ? 1 : 0
    const [x1, y1] = pt(ro, startAngle, ox, oy)
    const [x2, y2] = pt(ro, endAngle, ox, oy)
    const [x3, y3] = pt(rInner, endAngle, ox, oy)
    const [x4, y4] = pt(rInner, startAngle, ox, oy)
    return `M ${x1} ${y1} A ${ro} ${ro} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4} Z`
  }

  let angle = -90
  const slices = data.map((d, i) => {
    const frac = total ? d.value / total : 0
    const sweep = frac * 360
    const start = angle + gap / 2
    const end = angle + sweep - gap / 2
    angle += sweep
    const mid = (start + end) / 2
    const pct = total ? Math.round((d.value / total) * 100) : 0
    return { ...d, i, start, end, mid, pct }
  })

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 220 160" className="w-52 h-40 flex-shrink-0 overflow-visible" onMouseLeave={() => setActive(null)}>
        <defs>
          <filter id="pieShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#1E293B" floodOpacity="0.18" />
          </filter>
        </defs>

        <g transform="translate(15,0)">
          {slices.map(s => {
            const isActive = active === s.i
            return (
              <path
                key={s.i}
                d={ringSeg(s.start, s.end, isActive)}
                fill={s.color}
                opacity={active === null || isActive ? 1 : 0.4}
                filter={isActive ? 'url(#pieShadow)' : undefined}
                style={{ cursor: 'pointer', transition: 'opacity 0.25s ease, filter 0.25s ease' }}
                onMouseEnter={() => setActive(s.i)}
                onClick={() => setActive(active === s.i ? null : s.i)}
              />
            )
          })}

          {/* leader lines + % labels, shown for active slice (or all when small dataset) */}
          {slices.map(s => {
            if (active !== null && active !== s.i) return null
            if (s.pct < 4 && active === null) return null // avoid clutter when nothing selected
            const [ex, ey] = pt(rOuter + 8, s.mid)
            const dir = Math.cos(rad(s.mid)) >= 0 ? 1 : -1
            const lx = ex + dir * 14
            const ly = ey
            return (
              <g key={`lbl-${s.i}`} pointerEvents="none" style={{ transition: 'opacity 0.2s ease' }}>
                <line x1={ex} y1={ey} x2={lx} y2={ly} stroke="#94A3B8" strokeWidth="1" />
                <text x={lx + dir * 4} y={ly + 3} textAnchor={dir === 1 ? 'start' : 'end'} fontSize="10" fontWeight="700" fill="#334155">{s.pct}%</text>
              </g>
            )
          })}

          <text x={cx} y={cy - 3} textAnchor="middle" fontSize="19" fontWeight="700" fill="#1E293B">
            {active !== null ? data[active].value : total}
          </text>
          <text x={cx} y={cy + 13} textAnchor="middle" fontSize="9" fill="#64748B">
            {active !== null ? data[active].label : 'total'}
          </text>
        </g>
      </svg>

      <div className="space-y-1.5 flex-1 min-w-0">
        {data.map((d, i) => (
          <button
            key={i}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(active === i ? null : i)}
            className="w-full flex items-center justify-between gap-2 text-sm rounded-lg px-2 py-1.5 transition-all hover:bg-brand-off-white"
            style={{ opacity: active === null || active === i ? 1 : 0.5 }}
          >
            <span className="flex items-center gap-2 text-brand-charcoal min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="truncate">{d.label}</span>
            </span>
            <span className="font-semibold text-brand-charcoal flex-shrink-0">{d.value}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- Smooth spline path (Catmull-Rom -> bezier) ---------- */
function spline(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

/* ---------- Interactive Line Chart (light theme, hover/click tooltip) ---------- */
export function LineChart({ data, labels, color = '#162660', unit = '' }: {
  data: number[]; labels: string[]; color?: string; unit?: string
}) {
  const [active, setActive] = useState<number | null>(null)
  const W = 480, H = 160, pad = { l: 28, r: 12, t: 16, b: 22 }
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b
  const max = Math.max(...data) * 1.2 || 1
  const pts = data.map((v, i) => ({ x: pad.l + (i / (data.length - 1)) * iw, y: pad.t + ih - (v / max) * ih }))
  const line = spline(pts)
  const area = `${line} L ${pts[pts.length - 1].x} ${pad.t + ih} L ${pts[0].x} ${pad.t + ih} Z`
  const grid = [0, 0.33, 0.66, 1]
  const gradId = `lc-${color.replace('#', '')}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet" onMouseLeave={() => setActive(null)}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((g, i) => {
        const y = pad.t + ih - g * ih
        return (
          <g key={i}>
            <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '3 4'} />
            <text x={pad.l - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#94A3B8">{Math.round(g * max)}</text>
          </g>
        )
      })}
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {active !== null && (
        <line x1={pts[active].x} y1={pad.t} x2={pts[active].x} y2={pad.t + ih} stroke={color} strokeOpacity="0.3" strokeDasharray="3 3" />
      )}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={active === i ? 4.5 : 3} fill="#fff" stroke={color} strokeWidth="2" style={{ transition: 'r 0.15s ease' }} />
          <circle cx={p.x} cy={p.y} r="14" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} />
          <text x={p.x} y={H - 6} textAnchor="middle" fontSize="9" fill={active === i ? color : '#94A3B8'} fontWeight={active === i ? 700 : 400}>{labels[i]}</text>
        </g>
      ))}
      {active !== null && (() => {
        const p = pts[active]
        const above = p.y > pad.t + 40
        const ty = above ? p.y - 34 : p.y + 10
        return (
          <g pointerEvents="none">
            <rect x={p.x - 30} y={ty} width="60" height="26" rx="7" fill="#1E293B" />
            <text x={p.x} y={ty + 11} textAnchor="middle" fontSize="8" fill="#CBD5E1">{labels[active]}</text>
            <text x={p.x} y={ty + 22} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{data[active]}{unit}</text>
          </g>
        )
      })()}
    </svg>
  )
}
