import ProfileInfo from "../components/profile-info";
import Endocrinologist from "../components/endocrinologist"
import Questions from "../components/questions"
import style from "../css/pages/profile.module.css";

function Profile() {
    return (
        <section>
            <h1>Личные данные</h1>
            <div className={style.profileSection}>
                <ProfileInfo/>
                <Endocrinologist/>
                <Questions/>
            </div>
        </section>
    );
}

export default Profile;