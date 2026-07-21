import {useGetUserInfoQuery} from "../store/api";
import EditIcon from '@mui/icons-material/Edit';
import style from "../css/components/profile-info.module.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    if (isLoading) {
        return (<div>Загрузка....</div>)
    }
    const info = userInfo?.[0];
    const changeUserInfo = async () => {
        const data = {name, height, weight, shortInsulin, longInsulin}
        const response = await fetch("http://localhost:5000/api/changeUserInfo", {
            method: "POST",
            headers: {
                    "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        await refetch();
        setPopupOpen(false)
        setHeight(""); setWeight(""); setShortInsulin(""); setLongInsulin(""); setName("");
    }
    return (
        <div className={style.userInfoSection}>
            <AnimatePresence mode="wait">
                {popupOpen ? (
                    <motion.div className={style.changeName} key="edit" initial="closed" animate="open" exit="closed" variants={wrapperVariants}>
                        <label className={style.userName}>Имя 
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <label>Рост, см 
                            <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} />
                        </label>
                        <label>Вес, кг 
                            <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </label>
                        <label>Инсулин на 1 ХЕ, ед 
                            <input type="text" value={shortInsulin} onChange={(e) => setShortInsulin(e.target.value)} />
                        </label>
                        <label>Длинный инсулин, ед/сутки 
                            <input type="text" value={longInsulin} onChange={(e) => setLongInsulin(e.target.value)} />
                        </label>
                        <button className={style.addEntry} onClick={changeUserInfo}>
                            Сохранить изменения
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
        </div>
    )
}

export default ProfileInfo