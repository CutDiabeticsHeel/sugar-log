import {useGetTodaySugarLogQuery} from "../store/api";
import style from "../css/components/sugar-log-today.module.css"
import dayjs from "dayjs";
import { getSugarStatus } from "../utils/sugar-status.js";
import {useRef, useState, useEffect} from "react";
import Preloader from "./preloader.jsx";

function TodayLog() {
    const {data: todaySugarLog, isLoading} = useGetTodaySugarLogQuery();
    const [width, setWidth] = useState(0);
    const [smallLog, setSmallLog] = useState(false)
    const todayLogElement = useRef(null);
    function parseSugar(raw) {
        return parseFloat(String(raw).replace(",", "."));
    }
    const sugarStyles = {
        low: style.sugarLow,
        normal: style.sugarNormal,
        bitHigh: style.sugarBitHigh,
        high: style.sugarHigh,
    };
    useEffect(() => {
        const element = todayLogElement.current;
        
        if (!element) return;
        
        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
        });
    
        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [isLoading]);
        
    useEffect(() => {
        if (width < 301) {
            setSmallLog(true)
        } else {
            setSmallLog(false)
        }
    }, [width]);
    
    if (isLoading) return (<Preloader/>)

    const welcomePhrase = function(length) {
        if (length === 0) return "Сегодня вы не сделали ни одной записи";
        if (length === 1) return "Запись";
        if (length < 5) return "Записи";
        else return "Записей";
    }
    return (
        <div className={`${style.todayLog} ${smallLog ? style.todaySmallLog: "" }`}ref={todayLogElement}>
            <p>Сахара сегодня</p>
            <span className={style.entryCount}>{todaySugarLog.length} {welcomePhrase(todaySugarLog.length)}</span>
            <div className={style.list}>
                {todaySugarLog.map((entry) => (
                    <div key={entry.id} className={`${style.row} ${smallLog ? style.smallRow: "" }`}>
                        <span className={style.time}>{entry.time}</span>

                        <div className={style.content}>
                            <span className={style.food}>{entry.food}</span>
                            <span className={style.meta}>
                                {entry.insulin ? `${entry.insulin} ед короткого` : ""} {entry.XEBE ? `на ${entry.XEBE} ХЕ-БЖЕ` : ""}
                            </span>
                        </div>
                        <span className={sugarStyles[getSugarStatus(parseSugar(entry.sugar))]}>
                            {entry.sugar}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TodayLog;