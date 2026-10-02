import ProfileInfo from "../components/profile-info";
import Endocrinologist from "../components/endocrinologist"
import Questions from "../components/questions"
import style from "../css/pages/profile.module.css";
import InstallPrompt from '../components/InstallPrompt';

function Profile() {
    return (
        <section className="mainSection">
            <h1>Личные данные</h1>
            <div className={style.profileSection}>
                <ProfileInfo/>
                <Endocrinologist/>
                <Questions/>
                <InstallPrompt />
            </div>
        </section>
    );
}

export default Profile;