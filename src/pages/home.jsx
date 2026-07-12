import TodayLog from "../components/today-log";
import SugarForm from "../components/sugar-form";
import ProductForm from "../components/product-form";
import Welcome from "../components/welcome-section";
import style from "../css/pages/home.module.css"
import Masonry from "@mui/lab/Masonry";

function Home() {
    return (
        <section className={style.homePage}>
            <Welcome/>
            <Masonry columns={2} spacing={2}>
                <TodayLog />
                <SugarForm />
                <ProductForm />
            </Masonry>
            
        </section>
    );
}

export default Home;