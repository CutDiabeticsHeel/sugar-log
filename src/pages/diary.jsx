import SugarForm from "../components/sugar-form";
import SugarLogDay from "../components/sugar-log-day";
import CalendarFrom from "../components/calendar-form";
import { useState } from "react";
import style from "../css/pages/dairy.module.css";

function Diary() {
    const [popupOpen, setPopupOpen] = useState(false)

    return (
        <section className={style.dairy}>
            <h1>Дневник</h1>
            <div className={style.dairyActiveElements}>
                <CalendarFrom />
                <label >
                    <button onClick={() => setPopupOpen((prev) => !prev)} className={style.dairyAddEntry}>Добавить запись в дневник</button>
                </label>
            </div>
            {popupOpen && (
                <SugarForm/>
            )}
            <SugarLogDay/>
        </section>
    )
}

export default Diary;