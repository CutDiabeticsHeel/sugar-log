import style from "../css/components/metrics-chart.module.css";
import ReactECharts from "echarts-for-react";

function MetricsChart({metrics}) {

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
        <div className={style.metricsChart}>
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
        </div>
    )
}

export default MetricsChart;