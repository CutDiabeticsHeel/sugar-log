import { useState } from "react"
import InsulinSelect from "../components/insulinSelect"
import InsulinSugarCurve from "../components/inSugCurve"
import style from "../css/pages/carbInsulinCurve.module.css"
import CloseIcon from '@mui/icons-material/Close';

function CarbInsulinCurve() {
  const [curves, setCurves] = useState([])

  const addCurve = (curve) => setCurves((prev) => [...prev, curve])
  const removeCurve = (id) => setCurves((prev) => prev.filter((c) => c.id !== id))

  return (
    <section className={style.CarbInsulinCurve}>
      <h1>Кривая инсулин-углеводы</h1>
      <div className={style.CarbInsulinCurveGraph}>
        <InsulinSugarCurve curves={curves} />
        <div className={style.curveLegendContainer}>
            {curves.map((c) => (
            <button key={c.id} type="button" onClick={() => removeCurve(c.id)} className={style.curveLegend}>
                {c.name} {c.dose}
                <CloseIcon/>
            </button>
            ))}
        </div>
      </div>
      <div>Продукты</div>
      <InsulinSelect className={style.insulinSelect} onAdd={addCurve} />
    </section>
  )
}

export default CarbInsulinCurve