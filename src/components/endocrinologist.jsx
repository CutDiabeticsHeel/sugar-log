import {useGetEndocrinologistInfoQuery} from "../store/api";
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import style from "../css/components/endocrinologist.module.css";
import {useState, useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
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

function Endocrinologist(){
    const {data: endocrinologist, isLoading, refetch} = useGetEndocrinologistInfoQuery()
    const [popupOpen, setPopupOpen] = useState(false)
    const [formData, setFormData] = useState({
        day: '',
        month: '',
        time: '',
        name: ''
    });
    const info = endocrinologist?.[0];
    const [isLoad, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false)

    if (isLoading) return (<Preloader/>)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSave = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${API_URL}/update-endocrinologist`, {
                method: "PUT",
                headers: {
                        "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(formData)
            })
            setFormData({day: '', month: '', time: '', name: ''})
            setPopupOpen(prev => !prev)
            refetch()
            setIsSuccess(true)
            setTimeout(() => {
                setIsSuccess(false);
            }, 1488)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }     
    };
    return (
        <div className={style.endocrinologistSection}>
            <AnimatePresence mode="wait">
                {popupOpen ? (
                    <motion.div className={style.appointmentDate} key="edit" style={{ overflow: "hidden" }} initial="closed" animate="open" exit="closed" variants={wrapperVariants}>
                        <input name="day" value={formData.day} onChange={handleChange} placeholder={info.day} autoComplete="off"/>
                        <input name="month" value={formData.month} onChange={handleChange} placeholder={info.month} autoComplete="off"/>
                        <input name="time" value={formData.time} onChange={handleChange} placeholder={info.time} autoComplete="off"/>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder={info.name} autoComplete="off"/>
                        <button onClick={handleSave} className={style.addEntry}>Сохранить</button>
                        <button className={style.editButton} onClick={() => setPopupOpen(prev => !prev)}>
                            <UndoIcon fontSize="small"/>
                        </button>
                    </motion.div>
                ) : (
                <motion.div className={style.endocrinologistStaticSection} key="view"  initial="closed" animate="open" exit="closed" variants={wrapperVariants}>
                    <p>Когда к врачу <br/>
                        <span className={style.endocrinologistText}>Плановый прием эндокринолога</span>
                    </p>
                    <p className={style.appointmentDate}>{info.day} {info.month} в {info.time}</p>
                    <span>Врач: {info.name}</span>
                    <button className={style.editButton} onClick={() => setPopupOpen(prev => !prev)}>
                        <EditIcon fontSize="small"/>
                    </button>
                </motion.div>
                )}
            </AnimatePresence>
            {isLoad && (
                <SubmitingBlock operation="изменение информации о приёме"/>
            )}   
                <SuccessBlock show={isSuccess} operation="Информация о приеме успешно изменена"/>
        </div>
    )
}

export default Endocrinologist