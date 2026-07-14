import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import { useGetSugarLogForChartQuery } from "../store/api";

function MainGraph() {
    const { data: sugarLog, isLoading } = useGetSugarLogForChartQuery();

    if (isLoading) return <div>Загрузка...</div>;
    const data = sugarLog.map(row => [
        `${row.date} ${row.time}`,
        row.sugar
    ]);

    const maxSugar = Math.max(...sugarLog.map(i => i.sugar));
    const minSugar = Math.min(...sugarLog.map(i => i.sugar));

    const option = {
        tooltip: {
            trigger: "axis",
            formatter(params) {
                const item = params[0];

                return `
                    <b>${dayjs(item.value[0]).format("DD MMM HH:mm")}</b><br/>
                    Сахар: ${item.value[1]}
                `;
            }
        },

        xAxis: {
            type: "time",
            axisLabel: {
                formatter(value) {
                    return dayjs(value).format("DD MMM");
                }
            }
        },

        yAxis: {
            min: Math.floor(minSugar - 2),
            max: Math.ceil(maxSugar + 1)
        },

        series: [
            {
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 6,
                data,

                markArea: {
                    silent: true,
                    itemStyle: {
                        opacity: 0.22
                    },
                    data: [
                        [
                            {
                                yAxis: Math.floor(minSugar - 2),
                                itemStyle: {
                                    color: "#7C3AED"
                                }
                            },
                            {
                                yAxis: 4.2
                            }
                        ],
                        [
                            {
                                yAxis: 4.2,
                                itemStyle: {
                                    color: "#2E8B57"
                                }
                            },
                            {
                                yAxis: 8.5
                            }
                        ],
                        [
                            {
                                yAxis: 8.5,
                                itemStyle: {
                                    color: "#F59E0B"
                                }
                            },
                            {
                                yAxis: 10.5
                            }
                        ],
                        [
                            {
                                yAxis: 10.5,
                                itemStyle: {
                                    color: "#E74C3C"
                                }
                            },
                            {
                                yAxis: Math.ceil(maxSugar + 1)
                            }
                        ]
                    ]
                }
            }
        ]
    };

    return (
        <ReactECharts
            option={option}
            style={{ width: "100%", height: 500 }}
        />
    );
}

export default MainGraph;