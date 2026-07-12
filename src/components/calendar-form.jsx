import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DayPicker } from "@daypicker/react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "@daypicker/react/style.css";
import style from "../css/components/calendar-form.module.css";

function CalendarForm() {
    dayjs.locale("ru");
    const { control, setValue, handleSubmit } = useForm();
    const [popupOpen, setPopupOpen] = useState(false);
    const [displayDays, setDisplayDays]  = useState(7);
    const defaultSelected = {
        from: dayjs().toDate(),
        to: dayjs().toDate(),
    };
    const [range, setRange] = useState(defaultSelected);
    let footer = `Выберите дату.`;

    if (range?.from) {
        if (!range.to) {
        footer = (range.from);
        } else if (range.to) {
        footer = `${dayjs(range.from).format("DD MMM YYYY")} – ${dayjs(range.to).format("DD MMM YYYY")}`;
        }
    }

    const changePeriod = (days) => {
        setDisplayDays(days)
        setPopupOpen(false)
        console.log(days)
    };

    const onSubmit = async (data) => {
        const formattedData = {
            dateRange: {
                from: dayjs(data.dateRange.from).format('YYYY-MM-DD'),
                to: dayjs(data.dateRange.to).format('YYYY-MM-DD')
            }
        };
        const response = await axios.post("http://localhost:5000/api/selectPeriod",
            formattedData
        );
        console.log(data)
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
                <label className={style.customPeriodWrapper}>
                    <input type="button" onClick={() => setPopupOpen((prev) => !prev)} value="Свой период"  className={style.dateButton}/>
                    {popupOpen && (
                        <div className={style.datePopup}>
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
                            <button type="button" onClick={() => setRange(undefined) } className={style.popupButton}>
                            Сбросить период
                            </button>
                            <button type="submit" className={style.popupButton}>Применить период</button>
                        </div>
                    )}
                </label>
            </form>
    );
}

export default CalendarForm;