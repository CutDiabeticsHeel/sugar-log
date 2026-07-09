import ProfileInfo from "../components/profile-info";
import Endocrinologist from "../components/endocrinologist"
import Questions from "../components/questions"

function Profile() {
    return (
        <div>
            <h1>Профиль</h1>
            <ProfileInfo/>
            <Questions/>
            <Endocrinologist/>
        </div>
    );
}

export default Profile;