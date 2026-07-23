import {useGetDayPeriodSugarLogQuery} from "../store/api";
import style from "../css/components/sugar-log-day.module.css";
import dayjs from "dayjs";
import {getSugarStatus} from "../utils/sugar-status.js"
import {useState} from "react"


function SugarLogDay({ period }) {
    dayjs.locale("ru");
    const [defaultPeriod] = useState({
        from: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
    });
    const effectivePeriod = period?.from && period?.to ? period : defaultPeriod;

    const {data: sugarLog, isLoading} = useGetDayPeriodSugarLogQuery(effectivePeriod, {
        skip: !effectivePeriod?.from || !effectivePeriod?.to,
    });
    if (isLoading || !sugarLog) {
        return <div>Загрузка...</div>;
    }
    const groupedByDate = sugarLog.reduce((acc, record) => {
        const date = record.date;
        if (!acc[date]) {
            acc[date] = {
                records: [],
                proteinSum: 0,
                fatSum: 0,
                carbSum: 0,
                ccalSum: 0,
                xebeSum: 0,
                insulinSum: 0,
                sugarSum: 0
            };
        }
        acc[date].records.push(record);
        acc[date].sugarSum += record.sugar ?? 0;
        acc[date].proteinSum += record.protein ?? 0
        acc[date].fatSum += record.fat ?? 0
        acc[date].carbSum += record.carb ?? 0
        acc[date].ccalSum += record.ccal ?? 0
        acc[date].xebeSum += record.XEBE ?? 0
        acc[date].insulinSum += record.insulin ?? 0
        return acc;
    }, {});
    const sugarStyles = {
        low: style.sugarLow,
        normal: style.sugarNormal,
        bitHigh: style.sugarBitHigh,
        high: style.sugarHigh,
    };
    return (
        <div className={style.dairyContainer}>
            {sugarLog.length === 0 ?
            <span className={style.zeroDairy}>Записей для выбранного периода нет</span>
            :
            Object.entries(groupedByDate).map(([date, dayData]) => {
                const avgSugar = Number(dayData.sugarSum / dayData.records.length).toFixed(1);
                return (
                <div className={style.tableContainer} key={date}>
                        <table className={style.dayLog}>
                            <caption className={`${style.caption} ${sugarStyles[getSugarStatus(avgSugar)]}`}>{dayjs(date).format("DD MMM, dddd")}: Средний сахар за этот день - {avgSugar}. Всего Б: {dayData.proteinSum} Ж: {dayData.fatSum} У: {dayData.carbSum} Ккал: {dayData.ccalSum}</caption>
                            <thead className={style.headers}>
                                <tr>
                                    <th>Время</th>
                                    <th>Сахар</th>
                                    <th>Инсулин</th>
                                    <th>ХЕ + БЖЕ</th>
                                    <th>Б</th>
                                    <th>Ж</th>
                                    <th>У</th>
                                    <th>Ккал</th>
                                    <th>Еда</th>
                                    <th>Заметки</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dayData.records.map((record) => (
                                    <tr key={record.id}>
                                        <td>{record.time}</td>
                                        <td>{record.sugar}</td>
                                        <td>{record.insulin}</td>
                                        <td>{record.XEBE}</td>
                                        <td>{record.protein}</td>
                                        <td>{record.fat}</td>
                                        <td>{record.carb}</td>
                                        <td>{record.ccal}</td>
                                        <td>{record.food}</td>
                                        <td>{record.notes}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                </div>
                )
            })}
        </div>
    );
}

export default SugarLogDay;