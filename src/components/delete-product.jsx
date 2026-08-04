import style from "../css/components/delete-product.module.css";
import tableStyle from "../css/components/products-table.module.css";
import SuccessBlock from "./success-block";
import { createPortal } from "react-dom";
import {useState} from "react"

const API_URL = import.meta.env.VITE_API_URL;

function DeleteProductRecord({ product, onClose }) {
    const [isSuccess, setIsSuccess] = useState(false);

    const deleteProduct= async (id) => {
        try {
            const response = await fetch(`${API_URL}/delete-product`, {
                method: "DELETE",
                headers: {
                        "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(id)
            })
            setIsSuccess(true)
            setTimeout(() => {
                setIsSuccess(false);
                onClose()
            }, 505)
        } catch (err) {
            console.error(err)
            onClose()
        }
        
    }
    return createPortal(
        <div className={style.overlay} onClick={onClose}>
            <div className={style.deleteProduct} onClick={(e) => e.stopPropagation()}>
                <h3>Вы точно хотите удалить этот продукт?</h3>
                <div className={`${tableStyle.tableContainer} ${style.scrollableTable}`}>
                    <table className={tableStyle.productTable}>
                        <thead>
                            <tr>
                                <th>Продукт</th>
                                <th>Белки</th>
                                <th>Жиры</th>
                                <th>Углеводы</th>
                                <th>Вес продукта, г</th>
                                <th>Ккал</th>
                                <th>БЖЕ</th>
                                <th>ХЕ</th>
                                <th>ХЕ + БЖЕ</th>
                                <th>Инсулина</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={product.id}>
                                <td>{product["Продукт"]}</td>
                                <td>{product["Белки"]}</td>
                                <td>{product["Жиры"]}</td>
                                <td>{product["Углеводы"]}</td>
                                <td>{product["Вес продукта"]}</td>
                                <td>{Number(product["ккал"]).toFixed(0)}</td>
                                <td>{Number(product["БЖЕ"]).toFixed(2)}</td>
                                <td>{Number(product["ХЕ"]).toFixed(2)}</td>
                                <td>{Number(product["ХЕ + БЖЕ"]).toFixed(2)}</td>
                                <td>{Number(product["Всего инсулина"]).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={style.buttons}>
                    <button className={style.button} onClick={() => deleteProduct(product.id)}>Удалить</button>
                    <button className={style.button} onClick={onClose}>Не удалять</button>
                </div>
            </div>
            {isSuccess && (
                <SuccessBlock operation="Продукт успешно удален"/>
            )}
        </div>,
        document.body
    );
}

export default DeleteProductRecord;