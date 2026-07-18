import ProductForm from "../components/product-form";
import ProductsTable from "../components/products-table"
import style from "../css/pages/products.module.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const wrapperVariants = {
    closed: {
        height: 0,
        padding: 0,
        transition: { duration: 0.3, ease: "easeOut" }
    },
    open: {
        height: "auto",
        transition: { duration: 0.3, ease: "easeOut" }
    }
};

function ProductsPage() {
    const [openPopup, setOpenPopup] = useState(false)

    return (
        <section>
            <h1>Таблица продуктов с расчетом ХЕ, БЖЕ и дозы инсулина</h1>
            <div className={style.addProductForm}>
                <button className={style.ProductFormPopup} onClick={() => setOpenPopup(prev => !prev)}>
                    Добавить продукт
                </button>
                <AnimatePresence>
                    {openPopup && (
                        <motion.div
                            style={{ overflow: "hidden" }}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={wrapperVariants}
                        >
                            <ProductForm/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <ProductsTable/>
        </section>
    )
}

export default ProductsPage;