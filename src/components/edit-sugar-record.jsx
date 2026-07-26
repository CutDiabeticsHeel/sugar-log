import style from "../css/components/edit-sugar-record.module.css";
import SugarForm from "../components/sugar-form";
import { createPortal } from "react-dom";

function EditSugarRecord({record, onClose}) {
    return createPortal(
        <div className={style.overlay} onClick={onClose}>
            <div className={style.editSugarRecord} onClick={(e) => e.stopPropagation()}>
                <h3>Введите, что хотите изменить в записе</h3>
                <SugarForm defaultValue={record} onClose={onClose}/>
                <button className={style.button} onClick={onClose}>
                    Отмена
                </button>
            </div>
        </div>,
        document.body
    );
}

export default EditSugarRecord;