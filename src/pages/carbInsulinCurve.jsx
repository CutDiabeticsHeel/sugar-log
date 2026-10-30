import { useState } from "react"

import InsulinSelect from "../components/insulinSelect"
import style from "../css/pages/carbInsulinCurve.module.css"

function CarbInsulinCurve(){
    const [insulinDots, setInsulinDots] = useState([])

    return (
        <section className={style.CarbInsulinCurve}>
            <div>
                График
                {insulinDots.map((point, index) => (
                    <p key={index}>
                    X: {point.x}, Y: {point.y}
                    </p>
                ))}
            </div>
            <div>
                Продукты
            </div>
            <InsulinSelect setInsulinDots={setInsulinDots}/>
        </section>
    )
}

export default CarbInsulinCurve