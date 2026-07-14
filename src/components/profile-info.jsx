import {useGetUserInfoQuery} from "../store/api";
import EditIcon from '@mui/icons-material/Edit';
import style from "../css/components/profile-info.module.css";
import { useState } from "react";

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
                {popupOpen ? (
                    <div className={style.changeName}>
                        <label className={style.userName}>
                            Изменить имя на:
                            <input type="text" className={style.changeNameInput}/>
                        </label>
                        <button className={style.addEntry} onClick={handleSave}>
                            Применить
                        </button>
                    </div>
                ):(
                    <span className={style.userName}>
                        {info.name}
                        <button onClick={() => {setPopupOpen(prev => !prev)}} className={style.editButton}>
                            <EditIcon fontSize="small"/>
                        </button>
                    </span>
                )
                }
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