import {useGetTodaySugarLogQuery} from "../store/api";
import style from "../css/sugar-log-today.module.css"
import dayjs from "dayjs";
import { getSugarStatus } from "../utils/sugar-status.js";

function TodayLog() {
    const {data: todaySugarLog, isLoading} = useGetTodaySugarLogQuery();
    if (isLoading) {
        return <div className={style.welcomeSection}>Загрузка...</div>;
    }
    function parseSugar(raw) {
        return parseFloat(String(raw).replace(",", "."));
    }
    const sugarStyles = {
        low: style.sugarLow,
        normal: style.sugarNormal,
        bitHigh: style.sugarBitHigh,
        high: style.sugarHigh,
    };

    return (
        <div className={style.todayLog}>
            <p>Сахара сегодня</p>
            <span className={style.entryCount}>{todaySugarLog.length} записи</span>

            <div className={style.list}>
                {todaySugarLog.map((entry) => (
                    <div key={entry.id} className={style.row}>
                        <span className={style.time}>{entry.time}</span>

                        <div className={style.content}>
                            <span className={style.food}>{entry.food}</span>
                            <span className={style.meta}>
                                {entry.insulin} ед короткого на {entry.XEBE} ХЕ-БЖЕ
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