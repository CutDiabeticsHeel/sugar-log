import {useGetOnlySugarQuery} from "../store/api";
import calculateMetrics from "../utils/metrics";
import ReactECharts from "echarts-for-react";
import style from "../css/pages/stats.module.css";
import {useState} from "react";

function Stats() {
    const {data: onlySugar, isLoading} = useGetOnlySugarQuery()
    const [popupOpen, setPopupOpen] = useState(false)

    if (isLoading) return <div>Загрузка...</div>
    const sugarData = onlySugar.map(item => ({
        sugar: item.sugar,
        datetime: `${item.date}T${item.time}:00`
    }))
    const metrics = calculateMetrics(sugarData)
    console.log(sugarData, metrics)

    const barsOption = {
        xAxis: {
            type: 'category',
            data: ['Низкий', 'В диапазоне', 'Чуть выше нормы', 'Высокий'],
            axisLabel: {
                interval: 0 
            },
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
            data: [
                {
                    value: metrics.timeLow,
                    itemStyle: {
                        color: "#7C3AED"
                    }
                },
                {
                    value: metrics.timeInRange,
                    itemStyle: {
                        color: "#2E8B57"
                    }
                },
                {
                    value: metrics.timeBitHigh,
                    itemStyle: {
                        color: "#F59E0B"
                    }
                },
                {
                    value: metrics.timeHigh,
                    itemStyle: {
                        color: "#E74C3C"
                    }
                }
            ],
            type: 'bar',
            label: {
                show: true,
                position: "top",
                formatter: "{c}%"
            }
            }
        ]
    };

    const periodOption = {
        grid: {
            left: 100,
            right: 30,
            top: 20,
            bottom: 20,
        },
        xAxis: {
            type: "value",
            name: "ммоль/л",
            max: Math.max(metrics.morningAverage, metrics.dayAverage, metrics.eveningAverage, metrics.nightAverage) + 2,
        },
        yAxis: {
            type: "category",
            inverse: true,
            data: ["Утро", "День", "Вечер", "Ночь"],
        },
        series: [
            {
                type: "bar",
                data: [
                    {
                        value: metrics.morningAverage ?? 0,
                        itemStyle: {
                            color: "#013567"
                        }
                    },
                    {
                        value: metrics.dayAverage ?? 0,
                        itemStyle: {
                            color: "#013567"
                        }
                    },
                    {
                        value: metrics.eveningAverage ?? 0,
                        itemStyle: {
                            color: "#013567"
                        }
                    },
                    {
                        value: metrics.nightAverage ?? 0,
                        itemStyle: {
                            color: "#013567"
                        }
                    }
                ],
                label: {
                    show: true,
                    position: "right",
                    formatter: "{c} ммоль/л"
                },
                barWidth: 22,
                borderRadius: [0, 8, 8, 0]
            }
        ]
    };

    return (
        <section className={style.statsSection}>
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
                <button onClick={() => (setPopupOpen(prev => !prev))}>Узнать о метриках</button>
                {popupOpen && (
                    <div className="metrics-info">
                        <h2>Описание метрик</h2>

                        <ul>
                            <li>
                                <strong>Средний сахар</strong><br />
                                Среднее значение всех измерений за выбранный период.
                                <br />
                                <b>Норма:</b> 4.0–7.8 ммоль/л (индивидуально по рекомендациям врача).
                            </li>

                            <li>
                                <strong>Среднее количество измерений в день</strong><br />
                                Показывает, насколько регулярно проводится контроль сахара.
                                <br />
                                <b>Рекомендуется:</b> не менее 4 измерений в день при интенсивной терапии.
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
                                <br />
                                <b>Желательно:</b> менее 10 ммоль/л после еды.
                            </li>

                            <li>
                                <strong>Минимальный сахар</strong><br />
                                Самое низкое зарегистрированное значение.
                                <br />
                                <b>Норма:</b> не ниже 3.9 ммоль/л.
                            </li>

                            <li>
                                <strong>Самый частый сахар (мода)</strong><br />
                                Значение, которое встречалось чаще всего.
                            </li>

                            <li>
                                <strong>Время в диапазоне (TIR)</strong><br />
                                Процент измерений от 3.9 до 8.5 ммоль/л.
                                <br />
                                <b>Цель:</b> более 70%.
                            </li>

                            <li>
                                <strong>Низкий сахар (Low)</strong><br />
                                Процент измерений ниже 3.9 ммоль/л.
                                <br />
                                <b>Цель:</b> менее 4%.
                            </li>

                            <li>
                                <strong>Чуть выше нормы</strong><br />
                                Процент измерений от 8.5 до 12.5 ммоль/л.
                                <br />
                                <b>Чем меньше, тем лучше.</b>
                            </li>

                            <li>
                                <strong>Высокий сахар</strong><br />
                                Процент измерений выше 12.5 ммоль/л.
                                <br />
                                <b>Желательно:</b> менее 5%.
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

                            <li>
                                <strong>Самый высокий сахар и время</strong><br />
                                Позволяет определить, когда произошел максимальный подъем глюкозы.
                            </li>

                            <li>
                                <strong>Самый низкий сахар и время</strong><br />
                                Помогает выявить возможные гипогликемии и время их возникновения.
                            </li>
                        </ul>

                        <p>
                            <strong>Важно:</strong> приведенные нормы являются ориентировочными для большинства взрослых людей с сахарным диабетом. Индивидуальные целевые значения должны определяться лечащим врачом с учетом возраста, типа диабета, сопутствующих заболеваний и риска гипогликемии.
                        </p>
                    </div>
                )}
            </div>
            <div className={style.inRangeBars}>
                <span className={style.metricsTitle}>Время в целевом диапазоне</span>
                <ReactECharts
                    option={barsOption}
                    style={{ width: "100%", height: 500 }}
                />
            </div>
            <div className={style.timesOfDaySugar}>
                <span className={style.metricsTitle}>Средний сахар в разное время суток</span>
                <ReactECharts
                    option={periodOption}
                    style={{ width: "100%", height: 500 }}
                />
            </div>
        </section>
    )
}

export default Stats;