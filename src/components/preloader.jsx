import { createPortal } from "react-dom";
import style from "../css/components/preloader.module.css";
import "../css/main.css"
import { useEffect } from "react";

function Preloader() {
    useEffect(() => {
                document.body.classList.add('disable-scroll');
    
            return () => {
                document.body.classList.remove('disable-scroll');
            };
        }, []);
    return createPortal(
        <div className={style.preloaderContainer}>
            <div className={style.preloaderText}>
                <h1>Загрузка</h1>
                <div className={style.round}></div>
                <div className={style.round}></div>
                <div className={style.round}></div>
            </div>
        </div>,
        document.body
    );
}

export default Preloader;