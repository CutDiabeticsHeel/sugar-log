import { useState, useMemo } from "react"
import CloseIcon from "@mui/icons-material/Close"

import InsulinSelect from "../components/insulinSelect"
import InsulinSugarCurve from "../components/inSugCurve"
import ProductSelect from "../components/productSelect"
import style from "../css/pages/carbInsulinCurve.module.css"
import { makeProductCurve } from "../utils/carbCurve"

function CarbInsulinCurve() {
  const [curves, setCurves] = useState([])
  const [products, setProducts] = useState([])

  const productCurves = useMemo(
    () => products.map(makeProductCurve).filter(Boolean),
    [products]
  )

  const addCurve = (curve) => setCurves((prev) => [...prev, curve])
  const removeCurve = (id) => setCurves((prev) => prev.filter((c) => c.id !== id))
  const removeProduct = (id) => setProducts((prev) => prev.filter((p) => p.uid !== id))

  return (
    <section className={style.CarbInsulinCurve}>
      <h1>Кривая инсулин-углеводы</h1>
      <div className={style.CarbInsulinCurveGraph}>
        <InsulinSugarCurve curves={curves} productCurves={productCurves} />
        <div className={style.curveLegendContainer}>
          {productCurves.map((c) => (
            <button key={c.id} type="button" onClick={() => removeProduct(c.id)} className={style.curveLegend}>
              {c.name}, {Math.round(c.carbs)} г
              <CloseIcon />
            </button>
          ))}
          {curves.map((c) => (
            <button key={c.id} type="button" onClick={() => removeCurve(c.id)} className={style.curveLegend}>
              {c.name} {c.dose}
              <CloseIcon />
            </button>
          ))}
        </div>
      </div>
      <ProductSelect products={products} setProducts={setProducts} />
      <InsulinSelect className={style.insulinSelect} onAdd={addCurve} />
    </section>
  )
}

export default CarbInsulinCurve