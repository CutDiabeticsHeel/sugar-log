import {useGetUserInfoQuery} from "../store/api";
import EditIcon from '@mui/icons-material/Edit';
import style from "../css/components/profile-info.module.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UndoIcon from '@mui/icons-material/Undo';
import Preloader from "./preloader";
import SubmitingBlock from "./submiting";
import SuccessBlock from "./success-block";

const API_URL = import.meta.env.VITE_API_URL;
const wrapperVariants = {
    closed: {
        opacity: 0,
        transition: { duration: 0.3, ease: "easeOut" }
    },
    open: {
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" }
    }
};

function ProfileInfo(){
    const {data: userInfo, isLoading, refetch} = useGetUserInfoQuery();
    const [popupOpen, setPopupOpen] = useState(false);
    const [name, setName] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [shortInsulin, setShortInsulin] = useState("");
    const [longInsulin, setLongInsulin] = useState("");
    const [isLoad, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    if (isLoading) return (<Preloader/>)

    const info = userInfo?.[0];
    const changeUserInfo = async () => {
        setIsLoading(true)
        try {
            const data = {name, height, weight, shortInsulin, longInsulin}
            const response = await fetch(`${API_URL}/changeUserInfo`, {
                method: "POST",
                headers: {
                        "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(data)
            })
            await refetch();
            setPopupOpen(false)
            setHeight(""); setWeight(""); setShortInsulin(""); setLongInsulin(""); setName("");
            setIsSuccess(true)
            setTimeout(() => {
                setIsSuccess(false);
            }, 505)
        }catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className={style.userInfoSection}>
            <AnimatePresence mode="wait">
                {popupOpen ? (
                    <motion.div className={style.changeName} key="edit" initial="closed" animate="open" exit="closed" variants={wrapperVariants}>
                        <label className={style.userName}>Имя 
                            <input type="text" value={name} placeholder={info.name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <label>Рост, см 
                            <input type="text" value={height} placeholder={info.height} onChange={(e) => setHeight(e.target.value)} />
                        </label>
                        <label>Вес, кг 
                            <input type="text" value={weight} placeholder={info.weight} onChange={(e) => setWeight(e.target.value)} />
                        </label>
                        <label>Инсулин на 1 ХЕ, ед 
                            <input type="text" value={shortInsulin} placeholder={info.short_insulin} onChange={(e) => setShortInsulin(e.target.value)} />
                        </label>
                        <label>Длинный инсулин, ед/сутки 
                            <input type="text" value={longInsulin} placeholder={info.long_insulin} onChange={(e) => setLongInsulin(e.target.value)} />
                        </label>
                        <button className={style.addEntry} onClick={changeUserInfo}>
                            Сохранить изменения
                        </button>
                        <button className={style.editButton} onClick={() => setPopupOpen(prev => !prev)}>
                            <UndoIcon fontSize="small"/>
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        className={style.userValueContainer}
                        key="view"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={wrapperVariants}
                    >
                        <p className={style.valueContainer}>Имя: 
                            <span className={style.valueItem}>{info.name}</span>
                        </p>
                        <p className={style.valueContainer}>Рост: 
                            <span className={style.valueItem}>{info.height} см</span>
                            </p>
                        <p className={style.valueContainer}>Вес: 
                            <span className={style.valueItem}>{info.weight} кг</span>
                            </p>
                        <p className={style.valueContainer}>Инсулин на 1 ХЕ: 
                            <span className={style.valueItem}>{info.short_insulin} ед</span>
                            </p>
                        <p className={style.valueContainer}>Длинный инсулин: 
                            <span className={style.valueItem}>{info.long_insulin} ед/сутки</span>
                        </p>

                        <button onClick={() => setPopupOpen(true)} className={style.editButton}>
                            <EditIcon fontSize="small" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            {isLoad && (
                <SubmitingBlock operation="изменение информации о вас"/>
            )}
            {isSuccess && (
                <SuccessBlock operation="Информация о вас успешно изменена"/>
            )}
        </div>
    )
}

export default ProfileInfo