import style from "../css/components/metrics-block.module.css";
import {useState, useEffect} from "react"
import InfoIcon from '@mui/icons-material/Info';

function MetricsBlock ({metrics}) {
    const [popupOpen, setPopupOpen] = useState(false)

    useEffect(() => {
        if (popupOpen) {
            document.body.classList.add('disable-scroll');
        } else {
            document.body.classList.remove('disable-scroll');
        }

        return () => {
            document.body.classList.remove('disable-scroll');
        };
    }, [popupOpen]);

    return (
        <div className={style.metricsBlock}>
            <ul className={style.metricsList}>
                <li className={style.metricsTitle}>
                    Самые важные метрики
                </li>
                <li className={style.metricsListItem}>
                    Средний сахар
                    <span className={style.metricsValue}>{metrics.average}</span>
                </li>
                <li className={style.metricsListItem}>
                    Среднее кол-во измерений сахара в день
                    <span className={style.metricsValue}>{metrics.averagePerDay}</span>
                </li>
                <li className={style.metricsListItem}> 
                    Коэффициент вариации
                    <span className={style.metricsValue}>{metrics.coefficientVariation}</span>
                </li>
                <li className={style.metricsListItem}>
                    Общее количество измерений
                    <span className={style.metricsValue}>{metrics.count}</span>
                </li>
                <li className={style.metricsListItem}>
                    Самый высокий сахар
                    <span className={style.metricsValue}>{metrics.max}</span>
                </li>
                <li className={style.metricsListItem}>
                    Самый низкий сахар
                    <span className={style.metricsValue}>{metrics.min}</span>
                </li>
                <li className={style.metricsListItem}>
                    Самый часто встречающийся сахар
                    <span className={style.metricsValue}>{metrics.mode}</span>
                </li>
                <li className={style.metricsListItem}>
                    Медиана
                    <span className={style.metricsValue}>{metrics.median}</span>
                </li>
                <li className={style.metricsListItem}>
                    Стандартное отклонение
                    <span className={style.metricsValue}>{metrics.standardDeviation}</span>
                </li>
            </ul>
            <div>
                <button onClick={() => (setPopupOpen(prev => !prev))} className={style.metricsInfoButton}><InfoIcon/>Узнать о метриках</button>
                {popupOpen && (
                    <div className={style.overlay} onClick={() => setPopupOpen(false)}>
                        <div className={style.metricsInfo} onClick={(e) => e.stopPropagation()}>
                            <h2>Описание метрик</h2>

                            <ul>
                                <li>
                                    <strong>Средний сахар</strong><br />
                                    Среднее значение всех измерений за выбранный период.
                                </li>

                                <li>
                                    <strong>Среднее количество измерений в день</strong><br />
                                    Показывает, насколько регулярно проводится контроль сахара.
                                </li>

                                <li>
                                    <strong>Коэффициент вариации (CV)</strong><br />
                                    Показывает стабильность уровня глюкозы.
                                    <br />
                                    <b>Норма:</b> менее 36%.
                                </li>

                                <li>
                                    <strong>Количество измерений</strong><br />
                                    Общее число измерений за выбранный период.
                                </li>

                                <li>
                                    <strong>Максимальный сахар</strong><br />
                                    Самое высокое зарегистрированное значение.
                                </li>

                                <li>
                                    <strong>Минимальный сахар</strong><br />
                                    Самое низкое зарегистрированное значение.
                                </li>

                                <li>
                                    <strong>Самый частый сахар (мода)</strong><br />
                                    Значение, которое встречалось чаще всего.
                                </li>

                                <li>
                                    <strong>Время в диапазоне (TIR)</strong><br />
                                    Процент измерений от 3.9 до 8.5 ммоль/л.
                                </li>

                                <li>
                                    <strong>Низкий сахар</strong><br />
                                    Процент измерений ниже 3.9 ммоль/л.
                                </li>

                                <li>
                                    <strong>Чуть выше нормы</strong><br />
                                    Процент измерений от 8.5 до 12.5 ммоль/л.
                                </li>

                                <li>
                                    <strong>Высокий сахар</strong><br />
                                    Процент измерений выше 12.5 ммоль/л.
                                </li>

                                <li>
                                    <strong>Средний сахар утром</strong><br />
                                    Среднее значение с 06:00 до 12:00.
                                </li>

                                <li>
                                    <strong>Средний сахар днем</strong><br />
                                    Среднее значение с 12:00 до 18:00.
                                </li>

                                <li>
                                    <strong>Средний сахар вечером</strong><br />
                                    Среднее значение с 18:00 до 00:00.
                                </li>

                                <li>
                                    <strong>Средний сахар ночью</strong><br />
                                    Среднее значение с 00:00 до 06:00.
                                    <br />
                                    <b>Особенно важно:</b> контролировать отсутствие ночных гипогликемий.
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MetricsBlock;