import MainGraph from "../components/main-graph";
import DailyProfile from "../components/daily-profile"

function Graph() {
    return (
        <section>
            <h1>Графики сахаров</h1>
            <MainGraph/>
            <DailyProfile/>
        </section>
        
    );
}

export default Graph;