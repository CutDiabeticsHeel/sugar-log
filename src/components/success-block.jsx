import { createPortal } from "react-dom";
import style from "../css/components/success-block.module.css"

function SuccessBlock({operation}) {
    return createPortal(
        <div className={style.overlay}>
            <div className={style.submitingBlock}>
                <span className={style.submitingText}>{operation}</span>
            </div>
        </div>,
        document.body
    )
}

export default SuccessBlock;