import {useGetDayPeriodSugarLogQuery} from "../store/api";
import style from "../css/components/sugar-log-day.module.css";
import dayjs from "dayjs";
import {getSugarStatus} from "../utils/sugar-status.js"

function SugarLogDay() {
    dayjs.locale("ru");
    const {data: sugarLog, isLoading} = useGetDayPeriodSugarLogQuery();
    if (isLoading) {
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
        <div>
            {Object.entries(groupedByDate).map(([date, dayData]) => {
                const avgSugar = Number(dayData.sugarSum / dayData.records.length).toFixed(1);
                return (
                <div className={style.tableContainer}>
                        <table key={date} className={style.dayLog}>
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