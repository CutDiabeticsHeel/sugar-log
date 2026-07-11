import style from "../css/pages/home.module.css";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

function Welcome () {
    return (
        <div className={style.welcomeSection}>
            <h3> Сегодня, {dayjs().locale('ru').format('D MMMM')}</h3>
            <div className={style.infoSection}>
                <div className={style.infoContainer}>
                    <span>Средний сахар · 7 дней</span>
                    <p><span className={style.stats}> 8.0</span>ммоль / л</p>
                    <span>Цель: 5.8 - 8.5 ммоль/л</span>
                </div>
                <div className={style.infoContainer}>
                    <span>Длинный инсулин</span>
                    <p><span className={style.stats}>14</span>ед /сутки</p>
                    <span>Вечером в 20:00</span>
                </div>
                <div className={style.infoContainer}>
                    <span>Короткий</span>
                    <p><span className={style.stats}>1.4</span>ед / ХЕ-БЖЕ</p>
                    <span>Перед едой</span>
                </div>
            </div>
        </div>
    )
}

export default Welcome;