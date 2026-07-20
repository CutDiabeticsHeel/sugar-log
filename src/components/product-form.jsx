import { useForm, Controller  } from "react-hook-form"
import axios from "axios";
import style from "../css/components/product-form.module.css";
import { motion } from "framer-motion";
import {useRef, useState, useEffect} from "react";

const formVariants = {
    closed: {
        opacity: 0,
        transition: { duration: 0.15 }
    },
    open: {
        opacity: 1,
        transition: { duration: 0.25, delay: 0.35 }
    }
};

function ProductForm() {
    const {register, handleSubmit, watch, reset} = useForm()
    const toNumber = (value) => Number(String(value).replace(",", ".")) || 0;
    const [smallForm, setSmallForm] = useState(false)
    const [width, setWidth] = useState();
    const formElement = useRef(null);

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
    useEffect(() => {
            const element = formElement.current;
        
            if (!element) return;
        
            const observer = new ResizeObserver(([entry]) => {
                setWidth(entry.contentRect.width);
            });
    
            observer.observe(element);
        
            return () => {
                observer.disconnect();
            };
        }, []);
        
        useEffect(() => {
            if (width < 469) {
                setSmallForm(true)
            } else {
                setSmallForm(false)
            }
        }, [width]);


    return (
        <section className={style.productAddSection} >
                <motion.form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className={`${style.productForm } ${smallForm ? style.productSmallForm : "" }`} autoComplete="off" ref={formElement} variants={formVariants}>
                    <label className={style.nameProductConrainer} >
                        Название продукта
                        <input type="text" {...register("nameProduct")} required/>
                    </label>
                    <label className={style.proteinConrainer}>
                        Белки, г
                        <input type="text" {...register("protein")} required/>
                    </label>
                    <label className={style.fatConrainer}>
                        Жиры, г
                        <input type="text" {...register("fat")} required/>
                    </label>
                    <label className={style.carbsConrainer}>
                        Углеводы, г
                        <input type="text" {...register("carbs")} required/>
                    </label>
                    <label className={style.weigthConrainer}>
                        Вес продукта, г
                        <input type="text" {...register("weigth")} required/>
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
                </motion.form>
        </section>
    )
}

export default ProductForm;