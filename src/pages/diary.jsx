import SugarForm from "../components/sugar-form";
import SugarLogDay from "../components/sugar-log-day";
import CalendarFrom from "../components/calendar-form";
import { useState } from "react";
import style from "../css/pages/dairy.module.css";
import { motion, AnimatePresence } from "framer-motion";

const wrapperVariants = {
    closed: {
        height: 0,
        padding: 0,
        transition: { duration: 0.3, ease: "easeOut" }
    },
    open: {
        height: "auto",
        transition: { duration: 0.3, ease: "easeOut" }
    }
};

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
            <AnimatePresence>
                {popupOpen && (
                    <motion.div
                            style={{ overflow: "hidden" }}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={wrapperVariants}
                        >
                        <SugarForm/>
                    </motion.div>
                )}
            </AnimatePresence>
            <SugarLogDay/>
        </section>
    )
}

export default Diary;