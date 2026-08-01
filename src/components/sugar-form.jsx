import { useForm, Controller  } from "react-hook-form"
import style from "../css/components/sugar-form.module.css";
import AsyncSelect  from "react-select/async";
import Checkbox from "@mui/material/Checkbox";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import FormControlLabel from '@mui/material/FormControlLabel';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import {useRef, useState, useEffect} from "react";
import { motion } from "framer-motion";
import { useGetProductsQuery, useAddSugarRecordMutation  } from "../store/api";
import Preloader from "./preloader";
import { sugarEntrySchema } from "../utils/sugar-form-validate";
import SubmitingBlock from "./submiting";
dayjs.extend(customParseFormat);

const API_URL = import.meta.env.VITE_API_URL;

const formVariants = {
    closed: { opacity: 0, transition: { duration: 0.15 } },
    open: { opacity: 1, transition: { duration: 0.25, delay: 0.35 } }
};

function SugarForm({defaultValue, onClose}) {
    const { data: allProduct, isLoading, refetch} = useGetProductsQuery()
    const [addSugarRecord] = useAddSugarRecordMutation();
    const forEachProduct = (allProduct ?? []).map((item)=> ({
        value: item.id, 
        label: item["Продукт"],
        kcal: item["ккал"],
        protein: item["Белки"],
        fat: item["Жиры"],
        carbs: item["Углеводы"]
    }))
    const autoFoodPairs = defaultValue?.auto_food
        ? String(defaultValue.auto_food).split(',').map(pair => {
            const [id, amount] = pair.trim().split(':');
            return { id: Number(id), amount: Number(amount) };
        })
        : [];
    const defaultFoodList = autoFoodPairs
        .map(({ id, amount }) => {
            const product = forEachProduct.find(p => p.value === id);
            return product ? { ...product, amount } : null;
        })
        .filter(Boolean);
    const defaultActivity = defaultValue?.activity ? String(defaultValue.activity).split(',').map(a => a.trim()).filter(Boolean): [];
    const { register, handleSubmit, control, setError, formState: { errors }, watch, reset, setValue } = useForm({
        defaultValues: {
            time: defaultValue?.time ? dayjs(defaultValue.time, "HH:mm") : dayjs(),
            date: defaultValue?.date ? dayjs(defaultValue.date) : dayjs(),
            sugar: defaultValue?.sugar ?? "",
            insulin: defaultValue?.insulin ?? "",
            XEBE: defaultValue?.XEBE ?? "",
            foodText: defaultValue?.food_text ?? "",
            notes: defaultValue?.notes ?? "",
            activity: defaultActivity,
            carb: defaultValue?.manual_carb ?? "",
            protein: defaultValue?.manual_protein ?? "",
            fat: defaultValue?.manual_fat ?? "",
            ccal: defaultValue?.ccal ?? "",
        }
    })
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [foodList, setFoodList] = useState(defaultValue ? defaultFoodList : []);
    const Min = 0; 
    const Max = 100;
    const foodAmount = watch("foodAmount")
    const [isLoad, setIsLoading] = useState(false)

    const handleFoodAutoChange = async (selectedOptions) =>{
        const response = await fetch(`${API_URL}/foodAuto`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(selectedOptions)
        })
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        } else {
            const result = await response.json()
            setValue("insulin", result.insulin)
            setValue("XEBE", result.XEBE)
        }
    }

    useEffect(() => {
        if (foodList.length > 0) {
            handleFoodAutoChange(foodList);
        }
    }, [foodList]);
    
    if (isLoading) return (<Preloader/>)

    const onSubmit = async (data) => {
        data.food = foodList;
        data.time = dayjs(data.time).format("HH:mm");
        data.date = dayjs(data.date).format("YYYY-MM-DD");
        const parsed = sugarEntrySchema.safeParse(data)
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
            await addSugarRecord({...parsed.data, id: defaultValue?.id ?? null}).unwrap();
            onClose?.();
            reset();
            setFoodList([])
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false)
        }
    }

    const filterProducts= (inputValue) => {
        return forEachProduct.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(filterProducts(inputValue));
            }, 228);
    });

    const increment = (value) =>
        Math.min(Max, Number((Number(value) + 1).toFixed(1)));

    const decrement = (value) =>
        Math.max(Min, Number((Number(value) - 1).toFixed(1)));

    const addProduct = () => {
        if (!selectedProduct) return;

        setFoodList(prev => [
            ...prev,
            {
                ...selectedProduct,
                amount: 1,
            },
        ]);
        setSelectedProduct(null);
    };
    return (
        <section className={style.sugarAddSection} >
            <motion.form onSubmit={handleSubmit(onSubmit)} className={style.sugarForm} autoComplete="off" variants={formVariants}>
                <label className={style.timeInputContainer}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="time"
                            control={control}
                            defaultValue={defaultValue?.time ? dayjs(defaultValue.time, "HH:mm") : dayjs()}
                            render={({ field }) => (
                                <TimeField
                                    label="Выберите время"
                                    value={field.value}
                                    onChange={(newValue) => field.onChange(newValue)}
                                    format="HH:mm"
                                />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.time && <span className={style.errorText}>{errors.time.message}</span>}
                </label>               
                <label className={style.dateInputContainer}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="date"
                            control={control}
                            defaultValue={defaultValue?.date ? dayjs(defaultValue.date) : dayjs()}
                            render={({ field }) => (
                                <DatePicker
                                    label="Выберите дату"
                                    value={field.value}
                                    onChange={(newValue) => field.onChange(newValue)}
                                    format="DD-MM-YYYY"
                                />
                            )}
                        />
                    </LocalizationProvider>
                    {errors.date && <span className={style.errorText}>{errors.date.message}</span>}
                </label>
                <label className={style.sugarInputContainer}>
                    Cахар
                    <input className={style.sugarInput} {...register("sugar")}/>
                    {errors.sugar && <span className={style.errorText}>{errors.sugar.message}</span>}
                </label>
                <label className={style.insulinInputContainer}>
                    Инсулин
                    <input className={style.insulinInput} {...register("insulin")} />
                    {errors.insulin && <span className={style.errorText}>{errors.insulin.message}</span>}        
                </label>
                <label className={style.XEBEInputContainer}>
                    ХЕ и БЖЕ
                    <input className={style.XEBEInput} {...register("XEBE")}/>
                    {errors.XEBE && <span className={style.errorText}>{errors.XEBE.message}</span>}
                </label>
                <div className={style.macrosContainer}>
                    <label className={style.proteinConrainer}>
                        Белки, г
                        <input {...register("protein")}  />
                        {errors.protein && <span className={style.errorText}>{errors.protein.message}</span>}
                    </label>
                    <label className={style.fatConrainer}>
                        Жиры, г
                        <input {...register("fat")} />
                        {errors.fat && <span className={style.errorText}>{errors.fat.message}</span>}
                    </label>
                    <label className={style.carbsConrainer}>
                        Углеводы, г
                        <input {...register("carb")}  />
                        {errors.carb && <span className={style.errorText}>{errors.carb.message}</span>}
                    </label>
                </div>
                <label className={style.foodSelectContainer}>
                    <span>Выберите продукт и количество в порциях для автоподсчета</span>
                    <AsyncSelect
                        value={selectedProduct}
                        cacheOptions
                        defaultOptions
                        loadOptions={promiseOptions}
                        className={style.foodSelect}
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                backgroundColor: "var(--paper-soft)",
                                outline: state.isFocused ? "2px solid #000000" : "none",
                                border: "1px solid var(--border-color)",
                                borderRadius: "10px",
                                boxShadow: "none",
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: "var(--paper-soft)",
                            }),
                        }}
                        onChange={setSelectedProduct}
                    />
                    <button type="button" className={style.addEntry} onClick={addProduct}>Добавить продукт</button>
                    <ul className={style.productsList}>
                        {foodList.map((product, index) => (
                            <li key={index} className={style.foodItem}>
                                <span>{product.label}</span>
                                <button type="button" onClick={() => setFoodList(prev => prev.map((item, i) => i === index ? { ...item, amount: decrement(item.amount) } : item))}>
                                    <RemoveIcon />
                                </button>
                                <input
                                    className={style.foodAmount}
                                    name="foodAmount"
                                    value={product.amount}
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(",", ".");
                                        if (/^\d*\.?\d?$/.test(raw))
                                            setFoodList(prev => prev.map((item, i) => i === index ? { ...item, amount: raw === "" ? "" : raw } : item));
                                    }}
                                    onBlur={() => setFoodList(prev => prev.map((item, i) => i === index ? { ...item, amount: isNaN(parseFloat(item.amount)) ? 1 : parseFloat(item.amount) } : item))}
                                />
                                <button type="button" onClick={() => setFoodList(prev => prev.map((item, i) => i === index ? { ...item, amount: increment(item.amount) } : item))}>
                                    <AddIcon />
                                </button>
                                <button type="button" onClick={() => setFoodList(prev => prev.filter((_, i) => i !== index))}>
                                    <DeleteIcon/>
                                </button>
                            </li>
                        ))}
                    </ul>
                </label>
                <label className={style.foodInputContainer}>
                    <span>Или введите вручную, что вы съели</span>
                    <textarea className={style.foodInput} name="food" id="" {...register("foodText")}></textarea>
                </label>    
                <label className={style.notesInputContainer}>
                    Заметки, введите что-то важное
                    <textarea className={style.notesInput} name="notes" id="" {...register("notes")}></textarea>
                </label>
                <div className={style.activityContainer}>
                    <span>Готовые паттерны активности</span>
                    <div className={style.activityPatterns}>
                        <label className={style.activityCheckbox}>
                            <input type="checkbox" value="Тренировка" {...register("activity")} />
                            <FitnessCenterIcon />
                            Тренировка
                        </label>
                        <label className={style.activityCheckbox}>
                            <input type="checkbox" value="Прогулка" {...register("activity")} />
                            <DirectionsWalkIcon />
                            Прогулка
                        </label>
                    </div>
                </div>
                <button className={style.addEntry} type="submit">
                    {defaultValue?.id ? "Изменить запись" : "Добавить запись"}
                </button>
                {isLoad && (
                    <SubmitingBlock operation={["добавлание записи в Дневник Сахаров"]}/>
                )}
            </motion.form>
        </section>
    )
}

export default SugarForm;