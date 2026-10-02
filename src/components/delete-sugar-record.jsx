import { createPortal } from "react-dom";
import style from "../css/components/delete-sugar-record.module.css";
import SuccessBlock from "./success-block";
import {useState} from "react"
import { apiWrite } from "../offline/api";

function DeleteSugarRecord({ record, onClose, onDeleted }) {
    const [isSuccess, setIsSuccess] = useState(false);

    const deleteRecord = async (id) => {
        try {
            const { data, queued } = await apiWrite(
                'DELETE',
                '/delete-sugar-record',
                id
            );
            setIsSuccess(true)
            setTimeout(() => {
                setIsSuccess(false);
                onDeleted?.();
                onClose();
            }, 1488)
        } catch(err) {
            console.error(err)
            onClose();
        }
    }

    return createPortal(
        <div className={style.overlay} onClick={onClose}>
            <div className={style.deleteSugarRecord} onClick={(e) => e.stopPropagation()}>
                <h3>Вы точно хотите удалить эту запись?</h3>
                <div className={style.tableWrapper}>
                    <table className={style.dayLog}>
                        <thead>
                            <tr>
                                <th>Число</th>
                                <th>Время</th>
                                <th>Сахар</th>
                                <th>Инсулин</th>
                                <th>ХЕ + БЖЕ</th>
                                <th>Б</th>
                                <th>Ж</th>
                                <th>У</th>
                                <th>Ккал</th>
                                <th>Еда</th>
                                <th>Заметки</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={record.id}>
                                <td>{record.date}</td>
                                <td>{record.time}</td>
                                <td>{record.sugar}</td>
                                <td>{record.insulin}</td>
                                <td>{record.XEBE}</td>
                                <td>{record.protein}</td>
                                <td>{record.fat}</td>
                                <td>{record.carb}</td>
                                <td>{record.ccal}</td>
                                <td>{record.food}</td>
                                <td>{record.notes}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={style.buttons}>
                    <button className={style.button} onClick={() => deleteRecord(record.id)}>Удалить</button>
                    <button className={style.button} onClick={onClose}>Не удалять</button>
                </div>
            </div>
                <SuccessBlock show={isSuccess} operation="Запись успешно удалена"/>
        </div>,
        document.body
    );
}

export default DeleteSugarRecord;