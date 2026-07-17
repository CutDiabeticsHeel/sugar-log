import { useForm, Controller  } from "react-hook-form"
import axios from "axios";
import style from "../css/components/sugar-form.module.css";
import AsyncSelect  from "react-select/async";
import Checkbox from "@mui/material/Checkbox";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import FormControlLabel from '@mui/material/FormControlLabel';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import {useRef, useState, useEffect} from "react";

function SugarForm() {
    const { register, handleSubmit, control, reset, setValue } = useForm()
    const [width, setWidth] = useState(0);
    const [smallForm, setSmallForm] = useState(false)
    const formElement = useRef(null);
    const onSubmit = async (data) => {
        data.time = dayjs(data.time).format("HH:mm");
        data.date = dayjs(data.date).format("YYYY-MM-DD");
        const response = await axios.post(
            "http://localhost:5000/api/addSugar",
            data
        );
        reset();
    }
    const colourOptions = [
        {
            value: "Красный",
            label: "Красный",
        },
        {
            value: "Синий",
            label: "Синий",
        },
        {
            value: "Зеленый",
            label: "Зеленый",
        },
        {
            value: "Желтый",
            label: "Желтый",
        },
    ];
    const filterColors = (inputValue) => {
        return colourOptions.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(filterColors(inputValue));
            }, 228);
    });

    const handleFoodAutoChange = async (selectedOptions) =>{
        const response = await axios.post(
            "http://localhost:5000/api/foodAuto",
            selectedOptions
        );

        setValue("insulin", response.data.insulin)
        setValue("XEBE", response.data.XEBE)
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
        if (width < 450) {
            setSmallForm(true)
        } else {
            setSmallForm(false)
        }
    }, [width]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`${style.sugarForm} ${smallForm ? style.sugarSmallForm: "" }`} autoComplete="off" ref={formElement}>
            <label className={style.timeInputContainer}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                        name="time"
                        control={control}
                        defaultValue={dayjs()}
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
            </label>
            <label className={style.dateInputContainer}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                        name="date"
                        control={control}
                        defaultValue={dayjs()}
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
            </label>
            <label className={style.sugarInputContainer}>
                Cахар
                <input className={style.sugarInput} {...register("sugar")} />
            </label>
            <label className={style.insulinInputContainer}>
                Инсулин
                <input className={style.insulinInput} {...register("insulin")} />
            </label>
            <label className={style.XEBEInputContainer}>
                ХЕ и БЖЕ
                <input className={style.XEBEInput} {...register("XEBE")} />
            </label>
            <label className={style.foodSelectContainer}>
                <span>Выберите продукт для автоподсчета</span>
                <Controller
                    name="food"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                        <AsyncSelect
                            {...field}
                            isMulti
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
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: "var(--primary-element-background)",
                                }),
                                multiValueLabel: (base) => ({
                                    ...base,
                                    color: "#000000",
                                }),
                            }}
                            onChange={(selectedOptions) => {
                                field.onChange(selectedOptions);
                                handleFoodAutoChange(selectedOptions);
                            }}
                        />
                    )}
                />
            </label>
            <label className={style.foodInputContainer}>
                <span>Или введите вручную, что вы съели</span>
                <textarea className={style.foodInput} name="food" id="" {...register("foodText")}></textarea>
            </label>    
            <label className={style.notesInputContainer}>
                Заметки, введите что-то важное
                <textarea className={style.notesInput} name="" id=""></textarea>
            </label>
            <div className={style.activityContainer}>
                <span>Готовые паттерны активности</span>
                <div className={style.activityPatterns}>
                    <label className={style.activityCheckbox}>
                        <input type="checkbox" value="1" {...register("activity")} />
                        <FitnessCenterIcon />
                        Тренировка
                    </label>
                    <label className={style.activityCheckbox}>
                        <input type="checkbox" value="2" {...register("activity")} />
                        <DirectionsWalkIcon />
                        Прогулка
                    </label>
                </div>
            </div>
            <button className={style.addEntry} type="submit" >
                Добавить запись
            </button>
            
        </form>
    )
}

export default SugarForm;