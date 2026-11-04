import ProfileInfo from "../components/profile-info";
import Endocrinologist from "../components/endocrinologist"
import Questions from "../components/questions"
import style from "../css/pages/profile.module.css";
import InstallPrompt from '../components/InstallPrompt';
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate()
    const exit = () => {
        navigate("/")
    }

    return (
        <section className="mainSection">
            <h1>Личные данные</h1>
            <div className={style.profileSection}>
                <ProfileInfo/>
                <Endocrinologist/>
                <Questions/>
                <InstallPrompt />
            </div>
            <button className={style.exit} onClick={() => exit()}>Выйти из аккаунта</button>
        </section>
    );
}

export default Profile;