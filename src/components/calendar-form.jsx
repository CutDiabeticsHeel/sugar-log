import {  useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DayPicker } from "@daypicker/react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "@daypicker/react/style.css";
import style from "../css/components/calendar-form.module.css";
import { motion, AnimatePresence } from "framer-motion";
import useOutsideClick from "../hooks/close-popup";
import SuccessBlock from "./success-block";

const API_URL = import.meta.env.VITE_API_URL;
const wrapperVariants = {
    closed: {
        height: 0,
        transition: { 
            duration: 0.3, 
            ease: "easeOut",
            when: "afterChildren"
        }
    },
    open: {
        height: "auto",
        transition: { 
            duration: 0.3, 
            ease: "easeOut",
            when: "beforeChildren",
        }
    }
};
const childVariants = {
    closed: {
        opacity: 0,
        transition: { duration: 0.2 }
    },
    open: {
        opacity: 1,
        transition: { duration: 0.2 }
    }
};


function CalendarForm({ onChange }) {
    dayjs.locale("ru");
    const { control, setValue, handleSubmit } = useForm();
    const [popupOpen, setPopupOpen] = useState(false);
    const [displayDays, setDisplayDays]  = useState(7);
    const calendarRef = useRef(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const defaultSelected = {
        from: dayjs().toDate(),
        to: dayjs().toDate(),
    };
    const [range, setRange] = useState(defaultSelected);
    let footer = `Выберите дату.`;
    useOutsideClick(calendarRef, () => setPopupOpen(false));

    if (range?.from) {
        if (!range.to) {
        footer = (range.from);
        } else if (range.to) {
        footer = `${dayjs(range.from).format("DD MMM YYYY")} – ${dayjs(range.to).format("DD MMM YYYY")}`;
        }
    }

    const changePeriod = (days) => {
        setDisplayDays(days)
        onChange({
            from: dayjs().subtract(days - 1, "day").format("YYYY-MM-DD"),
            to: dayjs().format("YYYY-MM-DD"),
        });
        setPopupOpen(false)
    };

    const onSubmit = async (data) => {
        const formattedData = {
            dateRange: {
                from: dayjs(data.dateRange.from).format('YYYY-MM-DD'),
                to: dayjs(data.dateRange.to).format('YYYY-MM-DD')
            }
        };
        onChange({
            from: dayjs(data.dateRange.from).format('YYYY-MM-DD'),
            to: dayjs(data.dateRange.to).format('YYYY-MM-DD')
        });
        try {
            const responce = await fetch(`${API_URL}/selectPeriod`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(formattedData)
            })
            setIsSuccess(true)
            setTimeout(() => {
                setIsSuccess(false);
            }, 505)
        } catch(err) {
            console.error(err)
        }
        
        setPopupOpen(false)
    }

    return (
            <form onSubmit={handleSubmit(onSubmit)} className={style.dateForm}>
                <label>
                    <input type="button" onClick={() => changePeriod(7)} value="7 дней"  
                    className={`${style.dateButton} ${displayDays === 7 ? style.dateButtonActive : ""}`}/>
                </label>
                <label>
                    <input type="button" onClick={() => changePeriod(14)} value="14 дней" 
                    className={`${style.dateButton} ${displayDays === 14 ? style.dateButtonActive : ""}`}/>
                </label>
                <label>
                    <input type="button" onClick={() => changePeriod(30)} value="30 дней" 
                    className={`${style.dateButton} ${displayDays === 30 ? style.dateButtonActive : ""}`}/>
                </label>
                <label className={style.customPeriodWrapper} ref={calendarRef}>
                    <input type="button" onClick={() => setPopupOpen((prev) => !prev)} value="Свой период"  className={style.dateButton}/>
                    <AnimatePresence>
                        {popupOpen && (
                            <motion.div className={style.datePopup} initial="closed" animate="open" exit="closed" variants={wrapperVariants} >
                                <motion.div variants={childVariants}>
                                    <Controller 
                                        name="dateRange"
                                        control={control}
                                        render={({ field: { onChange }}) => (
                                            <DayPicker
                                                id="date"
                                                mode="range"
                                                defaultMonth={dayjs().toDate()}
                                                selected={range}
                                                footer={footer}
                                                onSelect={(selectedRange) => {
                                                    setRange(selectedRange);
                                                    onChange(selectedRange);
                                                }}
                                            />
                                        )}
                                    />
                                </motion.div>
                                <motion.button type="button" onClick={() => changePeriod(7)} className={style.popupButton} variants={childVariants}>
                                Сбросить период
                                </motion.button>
                                <motion.button type="submit" className={style.popupButton} variants={childVariants}>Применить период</motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </label>
                {isSuccess && (
                    <SuccessBlock operation="Период применен"/>
                )}
            </form>
    );
}

export default CalendarForm;