import { useState } from "react"

import InsulinSelect from "../components/insulinSelect"
import style from "../css/pages/carbInsulinCurve.module.css"

function CarbInsulinCurve(){
    const [insulinDots, setInsulinDots] = useState({})
    console.log(insulinDots)

    return (
        <section className={style.CarbInsulinCurve}>
            <div>
                График
            </div>
            <div>
                Продукты
            </div>
            <InsulinSelect setInsulinDots={setInsulinDots}/>
        </section>
    )
}

export default CarbInsulinCurve