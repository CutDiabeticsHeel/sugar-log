import ReactECharts from "echarts-for-react"
import style from "../css/components/inSugCurve.module.css"

const COLORS = ["#1B6BB8", "#013567", "#2E8B57", "#F59E0B", "#7C3AED"]
const TEXT = "#6B7280"
const GRID = "#dde8ed"

function InsulinSugarCurve({ curves = [], isf = 2 }) {
  const k = 60 * isf
  const xMax = Math.max(300, ...curves.map((c) => (c.offset ?? 0) + c.end)) + 30

  const series = curves.map((c, i) => {
    const color = COLORS[i % COLORS.length]
    const offset = c.offset ?? 0
    return {
      id: c.id,
      name: `${c.name}, ${c.dose} ЕД`,
      type: "line",
      data: c.points.map(([t, y]) => [t + offset, y * k]),
      showSymbol: false,
      lineStyle: { width: 3, color },
      itemStyle: { color },
      areaStyle: { color, opacity: 0.12 }, 
      markPoint: {
        symbol: "pin",
        symbolSize: 46,
        itemStyle: { color },
        data: [
          {
            coord: [c.peak + offset, c.peakY * k],
            label: { formatter: c.peak + " мин", color: "#fff" },
          },
        ],
      },
    }
  })

  const option = {
    legend: { top: 0, type: "scroll", textStyle: { color: TEXT } },
    tooltip: {
      trigger: "axis",
      valueFormatter: (v) => v.toFixed(2) + " ммоль/л в час",
    },
    grid: { left: 64, right: 24, top: 48, bottom: 40 },
    xAxis: {
      type: "value",
      min: 0,
      max: xMax,
      interval: 60,
      axisLabel: { color: TEXT, formatter: (v) => v / 60 + " ч" },
      axisLine: { lineStyle: { color: TEXT } },
    },
    yAxis: {
      type: "value",
      min: 0,
      name: "ммоль/л в час",
      nameTextStyle: { color: TEXT },
      axisLabel: { color: TEXT },
      splitLine: { lineStyle: { color: GRID } },
    },
    series,
  }

  return <ReactECharts className={style.curveGraph} style={{ height: "70vh" }} option={option} notMerge />
}

export default InsulinSugarCurve