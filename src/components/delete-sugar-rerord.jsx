import style from "../css/components/delete-sugar-rerord.module.css";

function DeleteSugarRecord({ record, onClose }) {
    const deleteRecord = async (id) => {
        const response = await fetch("http://localhost:5000/api/delete-sugar-record", {
            method: "DELETE",
            headers: {
                    "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(id)
        })
        onClose()
    }

    return (
        <div className={style.overlay}>
            <div className={style.deleteSugarRecord}>
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
                    <button className={style.button} onClick={() => deleteRecord(record.id)}>Да</button>
                    <button className={style.button} onClick={onClose}>Нет</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteSugarRecord;