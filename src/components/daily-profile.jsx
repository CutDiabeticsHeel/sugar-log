import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import { useGetSugarLogForChartQuery } from "../store/api";
import {useState} from "react";
import style from "../css/components/daily-profile.module.css";

function DailyProfile() {
    dayjs.locale("ru")
    const { data: sugarLog, isLoading } = useGetSugarLogForChartQuery();
    const [days, setDays] = useState(7)

    if (isLoading) return <div>Загрузка...</div>;

    const grouped = sugarLog.reduce((acc, row) => {
        const date = row.date;

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push([
            `2000-01-01 ${row.time}`,
            row.sugar
        ]);

        return acc;
    }, {});

    const maxSugar = Math.max(...sugarLog.map(item => item.sugar));
    const minSugar = Math.min(...sugarLog.map(item => item.sugar));

    const series = Object.entries(grouped).map(([date, data]) => ({
        name: dayjs(date).format("DD MMM"),
        type: "line",
        smooth: false,
        symbol: "circle",
        symbolSize: 7,
        data,
        connectNulls: false
    }));
    const visibleSeries = series.slice(-days);

    if (visibleSeries.length > 0) {
        visibleSeries[0] = {
            ...visibleSeries[0],
            markArea: {
                silent: true,
                itemStyle: {
                    opacity: 0.22
                },
                data: [
                    [
                        {
                            yAxis: Math.floor(minSugar - 2),
                            itemStyle: { color: "#7C3AED" }
                        },
                        { yAxis: 4.2 }
                    ],
                    [
                        {
                            yAxis: 4.2,
                            itemStyle: { color: "#2E8B57" }
                        },
                        { yAxis: 8.5 }
                    ],
                    [
                        {
                            yAxis: 8.5,
                            itemStyle: { color: "#F59E0B" }
                        },
                        { yAxis: 12.5 }
                    ],
                    [
                        {
                            yAxis: 12.5,
                            itemStyle: { color: "#E74C3C" }
                        },
                        { yAxis: Math.ceil(maxSugar + 1) }
                    ]
                ]
            }
        };
    }


    const option = {
        tooltip: {
            trigger: "axis",
            formatter(params) {
                let html = dayjs(params[0].value[0]).format("HH:mm") + "<br>";

                params.forEach(item => {
                    html += `${item.marker} ${item.seriesName}: ${item.value[1]} ммоль/л<br>`;
                });

                return html;
            }
        },

        legend: {
            top: 0
        },

        grid: {
            left: 50,
            right: 30,
            top: 50,
            bottom: 50
        },

        xAxis: {
            type: "time",
            min: "2000-01-01 00:00",
            max: "2000-01-02 00:00",
            axisLabel: {
                formatter(value) {
                    return dayjs(value).format("HH:mm");
                }
            }
        },

        yAxis: {
            min: Math.floor(minSugar - 2),
            max: Math.ceil(maxSugar + 1)
        },
        
        series: visibleSeries
    };

    return (
        <div className={style.dailyProfile}>
            <span>Выберите кол-во дней для графика суточных профилей</span>
            <div className={style.dayChoice}>
                <label className={style.dayItem}>
                    <input
                        type="radio"
                        name="days"
                        value={1}
                        checked={days === 1}
                        onChange={() => setDays(1)}
                    />
                    1 день
                </label>
                <label className={style.dayItem}>
                    <input
                        type="radio"
                        name="days"
                        value={3}
                        checked={days === 3}
                        onChange={() => setDays(3)}
                    />
                    3 дня
                </label>
                <label className={style.dayItem}>
                    <input
                        type="radio"
                        name="days"
                        value={5}
                        checked={days === 5}
                        onChange={() => setDays(5)}
                    />
                    5 дней
                </label>
                <label className={style.dayItem}>
                    <input
                        type="radio"
                        name="days"
                        value={7}
                        checked={days === 7}
                        onChange={() => setDays(7)}
                    />
                    7 дней
                </label>
            </div>
            <ReactECharts
                option={option}
                notMerge={true}
                lazyUpdate={false}
                style={{ width: "100%", height: 500 }}
            />
        </div>
        
    );
}

export default DailyProfile;