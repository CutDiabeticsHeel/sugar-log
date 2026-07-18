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
    const {data: userInfo, isLoading} = useGetUserInfoQuery()
    const [popupOpen, setPopupOpen] = useState(false)
    if (isLoading) {
        return (<div>Загрузка....</div>)
    }
    const info = userInfo?.[0];
    const handleSave = () => {
        setPopupOpen(prev => !prev)
    };
    return (
        <div className={style.userInfoSection}>
                <AnimatePresence mode="wait">
                    {popupOpen ? (
                        <motion.div className={style.changeName} key="edit" style={{ overflow: "hidden" }} initial="closed" animate="open" exit="closed" variants={wrapperVariants}>        
                            <label className={style.userName}>
                                Изменить имя на:
                                <input type="text" className={style.changeNameInput}/>
                            </label>
                            <button className={style.addEntry} onClick={handleSave}>
                                Применить
                            </button>
                        </motion.div>
                    ):(
                        <motion.span className={style.staticUserName} key="view" style={{ overflow: "hidden" }} initial="closed" animate="open" exit="closed" variants={wrapperVariants}>
                            {info.name}
                            <button onClick={() => {setPopupOpen(prev => !prev)}} className={style.editButton}>
                                <EditIcon fontSize="small"/>
                            </button>
                        </motion.span>
                    )
                    }
                </AnimatePresence>
                <label>
                    Рост, см
                    <input type="text" placeholder={info.heigth}/>
                </label>
                <label>
                    Вес, кг
                    <input type="text" placeholder={info.weigth}/>
                </label>
                <label>
                    Инсулин на 1 ХЕ, ед
                    <input type="text" placeholder={info.short_insulin}/>
                </label>
                <label>
                    Длинный инсулин, ед/сутки
                    <input type="text" placeholder={info.long_insulin}/>
                </label>
                <button type="submit" className={style.addEntry}>Сохранить изменения</button>
        </div>
    )
}

export default ProfileInfo