import ProductForm from "../components/product-form";
import ProductsTable from "../components/products-table"
import style from "../css/pages/products.module.css";
import { useState } from "react";

function ProductsPage() {
    const [openPopup, setOpenPopup] = useState(false)

    return (
        <section>
            <h1>Таблица продуктов с расчетом ХЕ, БЖЕ и дозы инсулина</h1>
            <div className={style.addProductForm}>
                <button className={style.ProductFormPopup} onClick={() => setOpenPopup (prev => !prev)}>Добавить продукт</button>
                {openPopup && (
                    <ProductForm/>
                )}
            </div>
            <ProductsTable/>
        </section>
    )
}

export default ProductsPage;