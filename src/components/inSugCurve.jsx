import ReactECharts from "echarts-for-react"
import style from "../css/components/inSugCurve.module.css"
import { sumCurves } from "../utils/carbCurve"

const COLORS = ["#1B6BB8", "#013567", "#2E8B57", "#7C3AED", "#E74C3C"]
const CARB_COLORS = ["#CFB093", "#B45309", "#EA580C", "#92400E", "#D97706"]
const TOTAL_COLOR = "#F59E0B"
const TEXT = "#6B7280"
const GRID = "#dde8ed"
const TICK = 30 

const fmtTime = (v) => `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`

const makeSeries = (c, color, factor, name, { width = 3, area = true, pin = true } = {}) => {
  const offset = c.offset ?? 0
  return {
    id: c.id,
    name,
    type: "line",
    data: c.points.map(([t, y]) => [t + offset, y * factor]),
    showSymbol: false,
    lineStyle: { width, color },
    itemStyle: { color },
    areaStyle: area ? { color, opacity: 0.12 } : undefined,
    markPoint: pin
      ? {
          symbol: "pin",
          symbolSize: 46,
          itemStyle: { color, opacity: 0.72 },
          data: [
            {
              coord: [c.peak + offset, c.peakY * factor],
              label: { formatter: c.peak + " мин", color: "#000", opacity: 1 },
            },
          ],
        }
      : undefined,
  }
}

function InsulinSugarCurve({ curves = [], productCurves = [], isf = 2, cr = 10 }) {
  const k = 60 * isf              
  const kCarb = (60 * isf) / cr   

  const ends = [
    ...curves.map((c) => (c.offset ?? 0) + c.end),
    ...productCurves.map((c) => (c.offset ?? 0) + c.end),
  ]
  const xMax = ends.length ? Math.max(...ends) : 240

  const total = productCurves.length > 1 ? sumCurves(productCurves) : null

  const carbSeries = productCurves.map((c, i) =>
    makeSeries(c, CARB_COLORS[i % CARB_COLORS.length], kCarb,
      `${c.name}, ${Math.round(c.carbs)} г`,
      { width: 2, area: false, pin: false })
  )

  const totalSeries = total
    ? [makeSeries(total, TOTAL_COLOR, kCarb,
        `Все продукты, ${Math.round(total.carbs)} г`, { width: 4 })]
    : []

  const insulinSeries = curves.map((c, i) =>
    makeSeries(c, COLORS[i % COLORS.length], k, `${c.name}, ${c.dose} ЕД`)
  )

  const option = {
    legend: { top: 0, type: "scroll", textStyle: { color: TEXT } },
    tooltip: {
      trigger: "axis",
      valueFormatter: (v) => v.toFixed(2) + " ммоль/л в час",
    },
    grid: { left: 16, right: 16, top: 48, bottom: 40, containLabel: true },
    xAxis: {
      type: "value",
      min: 0,
      max: xMax,
      interval: TICK,
      axisLabel: { color: TEXT, formatter: fmtTime, hideOverlap: true },
      axisLine: { lineStyle: { color: TEXT } },
    },
    yAxis: {
      type: "value",
      min: 0,
      name: "ммоль/л в час",
      nameTextStyle: { color: TEXT, align: "left" },
      axisLabel: { color: TEXT },
      splitLine: { lineStyle: { color: GRID } },
    },
    series: [...carbSeries, ...totalSeries, ...insulinSeries],
  }

  return (
    <ReactECharts
      className={style.curveGraph}
      style={{ height: "70vh" }}
      option={option}
      notMerge
    />
  )
}

export default InsulinSugarCurve