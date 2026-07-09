import { useForm } from "react-hook-form"
import axios from "axios";
import style from "../css/sugar-form.module.css";

function SugarForm() {
    const { register, handleSubmit } = useForm()
    const onSubmit = async (data) => {
        const response = await axios.post(
            "http://localhost:5000/api/sugar",
            data
        );
        console.log(response.data);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={style.sugarForm}>
            <label>
                Время
                <input {...register("firstName")} />
            </label>
            <label>
                cахар
                <input {...register("firstName")} />
            </label>
            <label>
                Инсулин
                <input {...register("firstName")} />
            </label>
            <label>
                ХЕ и БЖЕ
                <input {...register("firstName")} />
            </label>
            <label>
                Еда, введите что вы съели
                <textarea name="" id=""></textarea>
            </label>
            <label>
                <h3>ПОМЕНЯТЬ НА https://react-select.com/home</h3>
                Или выберите продукт для автоподсчета
                <select {...register("gender")}>
                    <option value="female">Выберите продукт</option>
                    <option value="male">male</option>
                    <option value="other">other</option>
                </select>
            </label>    
            <label>
                Заметки, введите что-то важное
                <textarea name="" id=""></textarea>
            </label>
            <label>
                раз
                <input type="checkbox" name="activity" value="" />
            </label>
            <label>
                два
                <input type="checkbox" name="activity" value="" />
            </label>
            <label>
                три
                <input type="checkbox" name="activity" value="" />
            </label>
            <label>
                пять
                <input type="checkbox" name="activity" value="" />
            </label>
            <label>
                много
                <input type="checkbox" name="activity" value="" />
            </label>
            <input type="submit" />
        </form>
    )
}

export default SugarForm;