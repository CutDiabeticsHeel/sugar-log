import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import { useGetSugarLogForChartQuery } from "../store/api";
import style from "../css/components/main-graph.module.css";
import {useState, useEffect} from "react";

function MainGraph() {
    const { data: sugarLog, isLoading } = useGetSugarLogForChartQuery();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
    
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 480);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    if (isLoading) return <div>Загрузка...</div>;
    const data = sugarLog.map(row => [
        `${row.date} ${row.time}`,
        row.sugar
    ]);

    const maxSugar = Math.max(...sugarLog.map(i => i.sugar));
    const minSugar = Math.min(...sugarLog.map(i => i.sugar));


    const option = {
        grid: {
            left: '2%',
            right: '2%',
            top: 20,
            bottom: 0,
            containLabel: true
        },
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
                rotate: isMobile ? 45: 0,
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
                                yAxis: 12.5
                            }
                        ],
                        [
                            {
                                yAxis: 12.5,
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
        <div className={style.mainGraph}>
            <span>Общий график сахаров</span>
            <ReactECharts
                option={option}
                style={{ width: "100%", height: 500 }}
            />
        </div>
    );
}

export default MainGraph;