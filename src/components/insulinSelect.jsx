import { useState } from "react"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"

import insulin from "../insulin.json"
import { makeInsulin } from "../utils/insulinCurve"
import style from "../css/components/insulinSelect.module.css"

const STEP = 0.5
const MIN = 0

function InsulinSelect({ onAdd  }) {
  const [insulinsAmounts, setAmounts] = useState({})

  const addInsulin = (name, dose) => {
    const d = parseFloat(dose)
    if (!d) return   

    const ins = insulin.find((i) => i.name === name)
    if (!ins) return

    const { points, peakY } = makeInsulin(ins, d)
    onAdd({
      id: crypto.randomUUID(),
      name,
      dose: d,
      points,
      peakY,
      start: ins.start,
      peak: ins.peak,
      end: ins.end,
    })
    setAmount(name, 0)
  }

  const setAmount = (name, dose) =>
    setAmounts((prev) => ({ ...prev, [name]: dose }))
  const getAmount = (name) => insulinsAmounts[name] ?? 0
  const changeAmount = (name, step) => {
    const current = parseFloat(getAmount(name)) || 0
    const next = Math.max(MIN, current + step)
    setAmount(name, String(Number(next.toFixed(1))))
  }

  return (
    <div className={style.insulinSection}>
      <h2>Инсулин</h2>
      <ul className={style.insuluinList}>
        {insulin.map((ins) => (
          <li className={style.insuluinListItem} key={ins.name}>
            <span className={style.insulinName}>{ins.name}</span>
            <div>
              <button
                className={style.counter}
                type="button"
                onClick={() => changeAmount(ins.name, -STEP)}
              >
                <RemoveIcon />
              </button>
              <input
                className={style.insuluinAmount}
                name="foodAmount"
                value={getAmount(ins.name)}
                onChange={(e) => {
                  const raw = e.target.value.replace(",", ".")
                  if (!/^\d*\.?\d?$/.test(raw)) return
                  setAmount(ins.name, raw)
                }}
                onBlur={() => {
                  const v = getAmount(ins.name)
                  if (v === "" || v === ".") setAmount(ins.name, "0")
                }}
              />
              <span className={style.unit}>ЕД</span>
              <button
                className={style.counter}
                type="button"
                onClick={() => changeAmount(ins.name, +STEP)}
              >
                <AddIcon />
              </button>
            </div>
            <button onClick={() => addInsulin(ins.name, getAmount(ins.name))} className={style.addInsulin}>Добавить</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default InsulinSelect
