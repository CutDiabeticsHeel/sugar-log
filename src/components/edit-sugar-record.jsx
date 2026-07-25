import style from "../css/components/edit-sugar-record.module.css";
import SugarForm from "../components/sugar-form";

function EditSugarRecord({record, onClose}) {
    return (
        <div className={style.overlay}>
            <div className={style.editSugarRecord}>
                <SugarForm/>
                <div className={style.buttons}>
                    <button className={style.button} onClick={onClose}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditSugarRecord;