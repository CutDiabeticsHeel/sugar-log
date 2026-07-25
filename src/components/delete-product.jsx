import style from "../css/components/delete-product.module.css";
import tableStyle from "../css/components/products-table.module.css";
import { createPortal } from "react-dom";

function DeleteProductRecord({ product, onClose }) {
    const deleteProduct= async (id) => {
        const response = await fetch("http://localhost:5000/api/delete-product", {
            method: "DELETE",
            headers: {
                    "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(id)
        })
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        } else {
            onClose()
        }
    }
    return createPortal(
        <div className={style.overlay}>
            <div className={style.deleteProduct}>
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
                                <th></th>
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
                    <button className={style.button} onClick={() => deleteProduct(product.id)}>Да</button>
                    <button className={style.button} onClick={onClose}>Нет</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default DeleteProductRecord;