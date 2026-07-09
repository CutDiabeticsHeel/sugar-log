import TodayLog from "../components/today-log";
import SugarForm from "../components/sugar-form";
import ProductForm from "../components/product-form";

function Home() {
    return (
        <main>
            <h1>Дом</h1>
            <SugarForm />
            <TodayLog />
            <ProductForm />
        </main>
    );
}

export default Home;