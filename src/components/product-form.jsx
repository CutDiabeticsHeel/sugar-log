import { useForm, Controller  } from "react-hook-form"
import axios from "axios";
import style from "../css/product-form.module.css";

function ProductForm() {

    const {register, handleSubmit, watch, reset} = useForm()

    const toNumber = (value) => Number(String(value).replace(",", ".")) || 0;

    const protein = toNumber(watch("protein"));
    const fat = toNumber(watch("fat"));
    const carbs = toNumber(watch("carbs"));
    const weight = toNumber(watch("weigth"));

    const XEBEValue = Number((((protein * 4 * weight) + (fat * 9 * weight)) / 10000).toFixed(2));
    const XEValue = Number(((carbs * weight / 100) / 12).toFixed(2));

    const onSubmit = async (data) =>{
        const responce = await axios.post(
            "http://localhost:5000/api/addProduct",
            data
        )
        reset();
    }
    return (
        <section className={style.productAddSection}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className={style.productForm}>
                <label className={style.nameProductConrainer}>
                    Название продукта
                    <input type="text" {...register("nameProduct")} />
                </label>
                <label className={style.proteinConrainer}>
                    Белки, г
                    <input type="text" {...register("protein")} />
                </label>
                <label className={style.fatConrainer}>
                    Жиры, г
                    <input type="text" {...register("fat")} />
                </label>
                <label className={style.carbsConrainer}>
                    Углеводы, г
                    <input type="text" {...register("carbs")} />
                </label>
                <label className={style.weigthConrainer}>
                    Вес продукта, г
                    <input type="text" {...register("weigth")} />
                </label>
                <div className={style.valueContainer}>
                    <p ><span>БЖЕ</span>{XEBEValue}</p>
                    <p><span>ХЕ</span>{XEValue}</p>
                    <p><span>ХЕ + БЖЕ</span>{Number((XEValue + XEBEValue).toFixed(2))}</p>
                    <p><span>Инсулин, ед</span>{Number(((XEValue + XEBEValue) * 1).toFixed(2))}</p>
                </div>
                <button className={style.addEntry} type="submit" >
                    Добавить продукт
                </button>
            </form>
        </section>
    )
}

export default ProductForm;