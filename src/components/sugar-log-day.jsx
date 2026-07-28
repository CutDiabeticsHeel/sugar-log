import {useGetDayPeriodSugarLogQuery} from "../store/api";
import style from "../css/components/sugar-log-day.module.css";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {getSugarStatus} from "../utils/sugar-status.js"
import {useState, useEffect, useMemo} from "react"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSugarRecord from "./delete-sugar-record.jsx";
import EditSugarRecord from "./edit-sugar-record.jsx";
import Preloader from "./preloader.jsx";

dayjs.extend(isSameOrBefore);

function SugarLogDay({ period }) {
    dayjs.locale("ru");
    const [defaultPeriod] = useState({
        from: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
    });
    const effectivePeriod = period?.from && period?.to ? period : defaultPeriod;
    const {data: sugarLog, isLoading, refetch} = useGetDayPeriodSugarLogQuery(effectivePeriod, {
        skip: !effectivePeriod?.from || !effectivePeriod?.to,
    });
    const [deletePopupId, setDeletePopupId] = useState(null)
    const [editPopupId, setEditPopupId] = useState(null)

    useEffect(() => {
        if (deletePopupId || editPopupId) {
            document.body.classList.add('disable-scroll');
        } else {
            document.body.classList.remove('disable-scroll');
        }
        return () => {
            document.body.classList.remove('disable-scroll');
        };
    }, [deletePopupId, editPopupId]);

    const allDates = useMemo(() => {
        const dates = [];
        let current = dayjs(effectivePeriod.from);
        const end = dayjs(effectivePeriod.to);
        while (current.isSameOrBefore(end, "day")) {
            dates.push(current.format("YYYY-MM-DD"));
            current = current.add(1, "day");
        }
        return dates.reverse();
    }, [effectivePeriod.from, effectivePeriod.to]);

    if (isLoading || !sugarLog) {
        return <Preloader/>
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
            {allDates.map((date) => {
                const dayData = groupedByDate[date];

                if (!dayData) {
                    return (
                        <div className={style.tableContainer} key={date}>
                            <div className={style.emptyDay}>
                                {dayjs(date).format("DD MMM, dddd")}: записей нет
                            </div>
                        </div>
                    );
                }

                const avgSugar = Number(dayData.sugarSum / dayData.records.length).toFixed(1);
                return (
                    <div className={style.tableContainer} key={date}>
                        <table className={style.dayLog}>
                            <caption className={`${style.caption} ${sugarStyles[getSugarStatus(avgSugar)]}`}> {dayjs(date).format("DD MMM, dddd")}: Средний сахар за этот день - {Number(avgSugar).toFixed(1)}. Всего Б: {Number(dayData.proteinSum).toFixed(0)} Ж: {Number(dayData.fatSum).toFixed(0)} У: {Number(dayData.carbSum).toFixed(0)} Ккал: {Number(dayData.ccalSum).toFixed(0)}</caption>
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
                                    <th></th>
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
                                        <td>{`${record.notes ? `${record.notes}.` : ""} ${record.activity ?  `Активности: ${record.activity}` : ""}`}</td>
                                        <td>
                                            <button className={style.icon}>
                                                <EditIcon  onClick={() => setEditPopupId(record.id)} sx={{ fill: "#013567" }}/>
                                                {editPopupId === record.id && (
                                                    <EditSugarRecord record={record} onClose={() => setEditPopupId(null)}/>
                                                )}
                                            </button>
                                            <button className={style.icon}>
                                                <DeleteIcon onClick={() => setDeletePopupId(record.id)} sx={{ fill: "#013567" }}/>
                                                {deletePopupId === record.id && (
                                                    <DeleteSugarRecord record={record} onClose={() => setDeletePopupId(null)}/>
                                                )}
                                            </button>
                                        </td>
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