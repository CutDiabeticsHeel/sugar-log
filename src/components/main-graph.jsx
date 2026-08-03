import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import { useGetDayPeriodSugarLogQuery } from "../store/api";
import style from "../css/components/main-graph.module.css";
import {useState, useEffect, useRef} from "react";
import Preloader from "./preloader";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

function MainGraph() {
    const [defaultPeriod] = useState({
        from: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
    });
    const {data: sugarLog, isLoading} = useGetDayPeriodSugarLogQuery(defaultPeriod);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
    const chart = useRef(null)
    const [isRotated, setIsRotated] = useState(false);
    const toggleRotate = () => setIsRotated(r => !r);
    
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 480);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    if (isLoading) return (<Preloader/>);
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
        <div  className={`${style.mainGraph} ${isRotated ? style.rotated : ""}`} ref={chart}>
            {isMobile && (
                <button onClick={toggleRotate} className={style.screenButton}> 
                    {isRotated ? <FullscreenExitIcon fontSize="large"/> : <FullscreenIcon fontSize="large"/>}
                </button>
            )}
            <span>Общий график сахаров</span>
            <ReactECharts
                option={option}
                style={{ width: "100%", height: isRotated ? "70vw" : 500 }}
            />
        </div>
    );
}

export default MainGraph;