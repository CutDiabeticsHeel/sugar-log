import TodayLog from "../components/today-log";
import SugarForm from "../components/sugar-form";
import ProductForm from "../components/product-form";
import Welcome from "../components/welcome-section";
import style from "../css/pages/home.module.css"

function Home() {
    return (
        <section className={style.homePage}>
            <Welcome/>
            <TodayLog />
            <SugarForm />
            <ProductForm />
        </section>
    );
}

export default Home;