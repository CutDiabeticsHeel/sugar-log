import { useGetDayPeriodSugarLogQuery, useGetUserInfoQuery } from "../store/api";
import style from "../css/pages/home.module.css";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import {useState} from "react"

function Welcome () {
    const [defaultPeriod] = useState({
        from: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
    });
    const {data: iserInfo, isLoadingSecond} = useGetUserInfoQuery();
    const {data: sugarLog, isLoading} = useGetDayPeriodSugarLogQuery(defaultPeriod);
    if (isLoading || isLoadingSecond) {
        return <div className={style.welcomeSection}>Загрузка...</div>;
    }
    const sugar = sugarLog.reduce((sum, item) => sum + item.sugar, 0)
    return (
        <div className={style.welcomeSection}>
            <h3> Сегодня, {dayjs().locale('ru').format('D MMMM')}</h3>
            <div className={style.infoSection}>
                <div className={style.infoContainer}>
                    <span>Средний сахар · 7 дней</span>
                    <p><span className={style.stats}> {Number(sugar / sugarLog.length).toFixed(1)}</span>ммоль / л</p>
                    <span>Цель: 5.8 - 8.5 ммоль/л</span>
                </div>
                <div className={style.infoContainer}>
                    <span>Длинный инсулин</span>
                    <p><span className={style.stats}>{iserInfo[0]["long_insulin"]}</span>ед /сутки</p>
                    <span>Вечером в 20:00</span>
                </div>
                <div className={style.infoContainer}>
                    <span>Короткий</span>
                    <p><span className={style.stats}>{iserInfo[0]["short_insulin"]}</span>ед / ХЕ-БЖЕ</p>
                    <span>Перед едой</span>
                </div>
            </div>
        </div>
    )
}

export default Welcome;