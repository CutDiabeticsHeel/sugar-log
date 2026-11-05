import style from "../css/pages/welcome.module.css"
import MedicalScene from "../components/MedicalScene";

import { useNavigate } from "react-router-dom";

function Welcome() {

    const navigate = useNavigate();

    const register = async (id) => {
        localStorage.setItem("UserID", id);
        navigate("/home")
    }

    return (
        <section className={style.welcomeSection}>
            <h1 className={style.greetings}>Выбери профиль</h1>
            <div className={style.registerButtonContainer} >
                <button className={style.registerButton} onClick={() => register(2)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" aria-labelledby="title desc" viewBox="0 0 512 512"><desc>Symmetrical, fierce front-facing rhinoceros head in a bold flat vector style.</desc><g stroke="#17191d" stroke-linecap="round" stroke-linejoin="round" stroke-width="15"><path fill="#9299a2" d="M157 150 91 82q-14-14-23 6l-11 65q-4 28 22 44l54 22ZM355 150l66-68q14-14 23 6l11 65q4 28-22 44l-54 22z"/><path fill="#626b75" stroke="none" d="m101 111 40 43-12 37-40-18zM411 111l-40 43 12 37 40-18z"/><path fill="#8b929c" d="M139 170q14-51 68-66 49-21 98 0 54 15 68 66l27 85q10 54-27 97-25 29-54 37H193q-29-8-54-37-37-43-27-97Z"/><path fill="#707984" stroke="none" d="M126 250q-8 68 40 111l33 17-19-105zM386 250q8 68-40 111l-33 17 19-105z"/><path fill="#aab0b8" d="M139 226q32-42 81-14l-17 44q-40-9-64 10zM373 226q-32-42-81-14l17 44q40-9 64 10z"/><path fill="#17191d" d="M164 269q28-25 54-3l-14 25q-23 11-40-5zM348 269q-28-25-54-3l14 25q23 11 40-5z"/><circle cx="190" cy="275" r="5" fill="#f4f5f6" stroke="none"/><circle cx="322" cy="275" r="5" fill="#f4f5f6" stroke="none"/><path fill="#e0e2e4" d="M256 154q-18 41-41 104l-24 79q-3 18 14 28 51 26 102 0 17-10 14-28l-24-79q-23-63-41-104"/><path fill="#b9bec4" stroke="none" d="M256 173q-14 56-31 102l-22 67q23 17 53 17z"/><path fill="#858d97" d="M165 347q25-28 53-18 38 17 76 0 28-10 53 18l9 44q-2 29-30 42H186q-28-13-30-42Z"/><path fill="#626b75" stroke="none" d="M178 382q29-22 53-9l25 19-17 25h-49zM334 382q-29-22-53-9l-25 19 17 25h49z"/><ellipse cx="207" cy="391" fill="#17191d" stroke="none" rx="13" ry="20" transform="rotate(-28 207 391)"/><ellipse cx="305" cy="391" fill="#17191d" stroke="none" rx="13" ry="20" transform="rotate(28 305 391)"/><path fill="none" d="M190 432q66 24 132 0"/></g></svg>
                    Леня
                </button>
                <button className={style.registerButton} onClick={() => register(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="none" viewBox="-3 0 150 150"><path fill="#bdbdbd" d="M126 37.5V50c-6.618 0-12 5.606-12 12.5v50c0 13.788-10.764 25-24 25H36V56.25H24l-6-12.5 10.044-13.775.012.031c2.088-2.337 4.824-4.031 7.944-4.693V12.5s24 6.25 24 25c0 4.25.054 17.169.09 25H66c13.254 0 24 11.194 24 25V125c6.618 0 12-5.606 12-12.5v-50c0-13.788 10.764-25 24-25"/><path fill="#000" d="M102 62.5v50c0 6.875-5.4 12.5-12 12.5v12.5c.114 0 .36 0 .6-.063.96-.062 2.826-.374 5.346-.749C106.32 133.938 114 124.188 114 112.5v-50c0-6.875 5.4-12.5 12-12.5V37.5c-13.26 0-24 11.188-24 25m-54 75h12c0-6.875 5.4-12.5 12-12.5v-12.5c-13.26 0-24 11.187-24 25" opacity=".3"/></svg>                    
                    Никита
                </button>
            </div>
            <MedicalScene/>
        </section>
    )
}

export default Welcome;