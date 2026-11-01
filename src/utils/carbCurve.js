const K = { kmax: 0.0465, kmin: 0.0076, kabs: 0.023, kgri: 0.0465, b: 0.69, c: 0.17, f: 0.9 }
const STEP = 5
const LENGTH = 480

export const carbsOf = (p) =>
  ((Number(p.amount) || 0) * Number(p.weight) * Number(p.carbs)) / 100

let base = null
function baseCurve() {
  if (base) return base
  const { kmax, kmin, kabs, kgri, b, c, f } = K
  const D = 1
  const alpha = 5 / (2 * D * (1 - b))
  const beta = 5 / (2 * D * c)
  const dt = 0.05
  const every = Math.round(STEP / dt)
  const n = Math.round(LENGTH / dt)

  let q1 = D, q2 = 0, qg = 0
  const ra = []
  for (let i = 0; i <= n; i++) {
    if (i % every === 0) ra.push(f * kabs * qg)
    const qs = q1 + q2
    const ke =
      kmin +
      ((kmax - kmin) / 2) *
        (Math.tanh(alpha * (qs - b * D)) - Math.tanh(beta * (qs - c * D)) + 2)
    const d1 = -kgri * q1
    const d2 = kgri * q1 - ke * q2
    const d3 = ke * q2 - kabs * qg
    q1 += d1 * dt
    q2 += d2 * dt
    qg += d3 * dt
  }

  const max = Math.max(...ra)
  let last = ra.length - 1
  while (last > 0 && ra[last] < max * 0.05) last--
  const y = ra.slice(0, last + 2)
  let peakI = 0
  y.forEach((v, i) => { if (v > y[peakI]) peakI = i })

  base = { y, peakI, peakY: y[peakI], end: (y.length - 1) * STEP }
  return base
}

export function makeProductCurve(p) {
  const carbs = carbsOf(p)
  if (!(carbs > 0)) return null
  const { y, peakI, peakY, end } = baseCurve()
  return {
    id: p.uid,
    name: p.label,
    carbs,                                  
    offset: Number(p.offset) || 0,         
    points: y.map((v, i) => [i * STEP, v * carbs]), 
    start: 0,
    peak: peakI * STEP,
    peakY: peakY * carbs,
    end,
  }
}

export function sumCurves(curves, name = "Все продукты") {
  if (!curves.length) return null
  const len =
    Math.max(...curves.map((c) => Math.round(((c.offset ?? 0) + c.end) / STEP))) + 1
  const ys = new Array(len).fill(0)

  curves.forEach((c) => {
    const shift = Math.round((c.offset ?? 0) / STEP)
    c.points.forEach(([, y], i) => {
      ys[i + shift] += y
    })
  })

  let peakI = 0
  ys.forEach((y, i) => { if (y > ys[peakI]) peakI = i })

  return {
    id: "carbs-total",
    name,
    carbs: curves.reduce((s, c) => s + c.carbs, 0),
    offset: 0,
    points: ys.map((y, i) => [i * STEP, y]),
    start: 0,
    peak: peakI * STEP,
    peakY: ys[peakI],
    end: (len - 1) * STEP,
  }
}