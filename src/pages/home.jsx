import TodayLog from "../components/today-log";
import SugarForm from "../components/sugar-form";
import ProductForm from "../components/product-form";
import Welcome from "../components/welcome-section";
import style from "../css/pages/home.module.css"
import Masonry from "@mui/lab/Masonry";
import {useEffect, useRef, useState} from "react";

function Home() {
    const windowElement = useRef(null);
    const [width, setWidth] = useState();
    const [mansoreColumn, setMansoryColumn] = useState(2);

    useEffect(() => {
        const element = windowElement.current;

        if (!element) return;

        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (width < 1040) {
            setMansoryColumn(1)
        } else {
            setMansoryColumn(2)
        }
    }, [width]);


    return (
        <section className={style.homePage} ref={windowElement}>
            <Welcome/>
            <Masonry columns={mansoreColumn} spacing={2}>
                <TodayLog />
                <SugarForm />
                <ProductForm />
            </Masonry>
            
        </section>
    );
}

export default Home;