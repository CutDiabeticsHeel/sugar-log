import { createPortal } from "react-dom";
import ProductForm from "./product-form";
import style from "../css/components/edit-product.module.css";

function EditProduct({product, onClose}) {
    return createPortal(
        <div className={style.overlay}>
            <div className={style.editProduct}>
                <h3>Введите, что хотите изменить в продукте</h3>
                <ProductForm defaultValue={product} onClose={onClose}/>
                <button className={style.button} onClick={onClose}>Отмена</button>
            </div>
        </div>,
        document.body
    );
};

export default EditProduct;