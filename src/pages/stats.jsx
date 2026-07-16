import {useGetOnlySugarQuery} from "../store/api";
import calculateMetrics from "../utils/metrics";
import style from "../css/pages/stats.module.css";
import MetricsBlock from "../components/metrics-block";
import MetricsChart from "../components/metrics-chart";

function Stats() {
    const {data: onlySugar, isLoading} = useGetOnlySugarQuery()

    if (isLoading) return <div>Загрузка...</div>
    
    const sugarData = onlySugar.map(item => ({
        sugar: item.sugar,
        datetime: `${item.date}T${item.time}:00`
    }))
    const metrics = calculateMetrics(sugarData)

    console.log(sugarData, metrics)

    return (
        <section className={style.statsSection}>
            <MetricsBlock metrics={metrics}/>
            <MetricsChart metrics={metrics}/>
        </section>
    )
}

export default Stats;