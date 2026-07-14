import {useGetEndocrinologistInfoQuery} from "../store/api";
import EditIcon from '@mui/icons-material/Edit';
import style from "../css/components/endocrinologist.module.css";
import {useState, useEffect} from "react";

function Endocrinologist(){
    const {data: endocrinologist, isLoading} = useGetEndocrinologistInfoQuery()
    const [popupOpen, setPopupOpen] = useState(false)
    const [formData, setFormData] = useState({
        day: '',
        month: '',
        time: '',
        name: ''
    });
    const info = endocrinologist?.[0];
    if (isLoading) {
        return (<div>Загрузка....</div>)
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSave = () => {
        console.log(formData)
        setPopupOpen(prev => !prev)
    };
    return (
        <div className={style.endocrinologistSection}>
            {popupOpen ? (
                <div className={style.appointmentDate}>
                    <input name="day" value={formData.day} onChange={handleChange} placeholder={info.day}/>
                    <input name="month" value={formData.month} onChange={handleChange} placeholder={info.month}/>
                    <input name="time" value={formData.time} onChange={handleChange} placeholder={info.time}/>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder={info.name}/>
                    <button onClick={handleSave} className={style.addEntry}>Сохранить</button>
                </div>
            ) : (
            <div className={style.endocrinologistSection}>
                <p>Когда к врачу <br/>
                    <span className={style.endocrinologistText}>Плановый прием эндокринолога</span>
                </p>
                <p className={style.appointmentDate}>{info.day} {info.month} в {info.time}</p>
                <span>Врач: {info.name}</span>
                <button className={style.editButton} onClick={() => setPopupOpen(prev => !prev)}>
                    <EditIcon fontSize="small"/>
                </button>
            </div>
            )}   
        </div>
    )
}

export default Endocrinologist