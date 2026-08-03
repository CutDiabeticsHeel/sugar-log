import { useForm, Controller  } from "react-hook-form"
import style from "../css/components/product-form.module.css";
import { motion } from "framer-motion";
import {useRef, useState, useEffect} from "react";
import {useGetUserInfoQuery} from "../store/api";
import Preloader from "./preloader";
import SubmitingBlock from "./submiting";
import { productEntrySchema } from "../utils/product-form-validate";

const API_URL = import.meta.env.VITE_API_URL;
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

function ProductForm({defaultValue, onClose}) {
    const {data: userInfo, isLoading, refetch} = useGetUserInfoQuery();
    const {register, handleSubmit, watch, reset, setError, formState: { errors },} = useForm({
        defaultValues: {
            nameProduct: defaultValue?.["Продукт"] ?? "",
            protein: defaultValue?.["Белки"] ?? "",
            fat: defaultValue?.["Жиры"] ?? "",
            carbs: defaultValue?.["Углеводы"] ?? "",
            weigth: defaultValue?.["Вес продукта"] ?? "",
        }
    })
    const toNumber = (value) => Number(String(value).replace(",", ".")) || 0;
    const [smallForm, setSmallForm] = useState(false)
    const [width, setWidth] = useState();
    const formElement = useRef(null);

    const protein = toNumber(watch("protein"));
    const fat = toNumber(watch("fat"));
    const carbs = toNumber(watch("carbs"));
    const weight = toNumber(watch("weigth"));

    const XEBEValue = Number((((protein * 4 * weight) + (fat * 9 * weight)) / 10000).toFixed(2));
    const XEValue = Number((((carbs * weight / 100)) / 12).toFixed(2));
    const [isLoad, setIsLoading] = useState(false)

    const onSubmit = async (data) =>{
        const parsed = productEntrySchema.safeParse(data)
        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            Object.entries(fieldErrors).forEach(([field, messages]) => {
                if (messages?.length) {
                    setError(field, { type: "manual", message: messages[0]});
                }
            })
            return;
        }
        setIsLoading(true)
        try {
            const responce = await fetch(`${API_URL}/addProduct`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    ...data,
                    id: defaultValue?.id ?? null,
                })
            })
            onClose?.();
            reset();
        }catch (err) {
            console.error({ error: err.message });
        } finally {
            setIsLoading(false)
        }
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

    if (isLoading) return (<Preloader/>)

    return (
        <section className={style.productAddSection} >
                <motion.form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className={`${style.productForm } ${smallForm ? style.productSmallForm : "" }`} autoComplete="off" ref={formElement} variants={formVariants}>
                    <label className={style.nameProductConrainer} >
                        Название продукта
                        <input type="text" {...register("nameProduct")}  placeholder={defaultValue ? defaultValue["Продукт"] : ""}/>
                        {errors.nameProduct && <span className={style.errorText}>{errors.nameProduct.message}</span>}
                    </label>
                    <label className={style.proteinConrainer}>
                        Белки, г
                        <input type="text" {...register("protein")}  placeholder={defaultValue ? defaultValue["Белки"] : ""}/>
                        {errors.protein && <span className={style.errorText}>{errors.protein.message}</span>}
                    </label>
                    <label className={style.fatConrainer}>
                        Жиры, г
                        <input type="text" {...register("fat")}  placeholder={defaultValue ? defaultValue["Жиры"] : ""}/>
                        {errors.fat && <span className={style.errorText}>{errors.fat.message}</span>}
                    </label>
                    <label className={style.carbsConrainer}>
                        Углеводы, г
                        <input type="text" {...register("carbs")}  placeholder={defaultValue ? defaultValue["Углеводы"] : ""}/>
                        {errors.carbs && <span className={style.errorText}>{errors.carbs.message}</span>}
                    </label>
                    <label className={style.weigthConrainer}>
                        Вес продукта, г
                        <input type="text" {...register("weigth")}  placeholder={defaultValue ? defaultValue["Вес продукта"] : ""}/>
                        {errors.weigth && <span className={style.errorText}>{errors.weigth.message}</span>}
                    </label>
                    <div className={style.valueContainer}>
                        <p ><span>БЖЕ</span>{XEBEValue}</p>
                        <p><span>ХЕ</span>{XEValue}</p>
                        <p><span>ХЕ + БЖЕ</span>{Number((XEValue + XEBEValue).toFixed(2))}</p>
                        <p><span>Инсулин, ед</span>{Number(((XEValue + XEBEValue) * userInfo[0]["short_insulin"]).toFixed(2))}</p>
                    </div>
                    <button className={style.addEntry} type="submit" >
                        {defaultValue ? "Изменить продукт" : "Добавить продукт"}
                    </button>
                </motion.form>
                {isLoad && (
                    <SubmitingBlock operation="добавление в Список Продуктов"/>
                )}
        </section>
    )
}

export default ProductForm;