import { createPortal } from "react-dom";
import style from "../css/components/submiting.module.css"

function SubmitingBlock({operation}) {
    return createPortal(
        <div className={style.overlay}>
            <div className={style.submitingBlock}>
                <span className={style.submitingText}>Выполняется {operation}. Подождите немного.</span>
                <span className={style.loader}></span>
            </div>
        </div>,
        document.body
    )
}

export default SubmitingBlock;