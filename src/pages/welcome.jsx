import style from "../css/pages/welcome.module.css"
import { useNavigate } from "react-router-dom";
import { apiWrite } from "../offline/api"

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
                    <svg xmlns="http://www.w3.org/2000/svg" height="75" width="75" viewBox="0 0 512 512" role="img" aria-labelledby="title desc">
                        <title id="title">Rhinoceros head icon</title>
                        <desc id="desc">Symmetrical, fierce front-facing rhinoceros head in a bold flat vector style.</desc>
                        <g stroke="#17191d" stroke-width="15" stroke-linecap="round" stroke-linejoin="round">
                            <path fill="#9299a2" d="M157 150 91 82Q77 68 68 88L57 153Q53 181 79 197L133 219Z"/>
                            <path fill="#9299a2" d="m355 150 66-68q14-14 23 6l11 65q4 28-22 44l-54 22z"/>
                            <path fill="#626b75" stroke="none" d="m101 111 40 43-12 37-40-18z"/>
                            <path fill="#626b75" stroke="none" d="m411 111-40 43 12 37 40-18z"/>
                            <path fill="#8b929c" d="M139 170Q153 119 207 104Q256 83 305 104Q359 119 373 170L400 255Q410 309 373 352Q348 381 319 389L193 389Q164 381 139 352Q102 309 112 255Z"/>
                            <path fill="#707984" stroke="none" d="M126 250q-8 68 40 111l33 17-19-105z"/>
                            <path fill="#707984" stroke="none" d="M386 250q8 68-40 111l-33 17 19-105z"/>
                            <path fill="#aab0b8" d="M139 226q32-42 81-14l-17 44q-40-9-64 10z"/>
                            <path fill="#aab0b8" d="M373 226q-32-42-81-14l17 44q40-9 64 10z"/>
                            <path fill="#17191d" d="M164 269q28-25 54-3l-14 25q-23 11-40-5z"/>
                            <path fill="#17191d" d="M348 269q-28-25-54-3l14 25q23 11 40-5z"/>
                            <circle cx="190" cy="275" r="5" fill="#f4f5f6" stroke="none"/>
                            <circle cx="322" cy="275" r="5" fill="#f4f5f6" stroke="none"/>
                            <path fill="#e0e2e4" d="M256 154Q238 195 215 258L191 337Q188 355 205 365Q256 391 307 365Q324 355 321 337L297 258Q274 195 256 154Z"/>
                            <path fill="#b9bec4" stroke="none" d="M256 173q-14 56-31 102l-22 67q23 17 53 17z"/>
                            <path fill="#858d97" d="M165 347Q190 319 218 329Q256 346 294 329Q322 319 347 347L356 391Q354 420 326 433H186Q158 420 156 391Z"/>
                            <path fill="#626b75" stroke="none" d="M178 382q29-22 53-9l25 19-17 25h-49z"/>
                            <path fill="#626b75" stroke="none" d="M334 382q-29-22-53-9l-25 19 17 25h49z"/>
                            <ellipse cx="207" cy="391" rx="13" ry="20" transform="rotate(-28 207 391)" fill="#17191d" stroke="none"/>
                            <ellipse cx="305" cy="391" rx="13" ry="20" transform="rotate(28 305 391)" fill="#17191d" stroke="none"/>
                            <path fill="none" d="M190 432q66 24 132 0"/>
                        </g>
                    </svg>
                    Леня
                </button>
                <button className={style.registerButton} onClick={() => register(1)}>
                    <svg height="75" width="75" viewBox="-3 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M126 37.5V50C119.382 50 114 55.6063 114 62.5V112.5C114 126.288 103.236 137.5 90 137.5H36V62.5V56.25H24L18 43.75L28.044 29.975L28.056 30.0063C30.144 27.6688 32.88 25.975 36 25.3125V12.5C36 12.5 60 18.75 60 37.5C60 41.75 60.054 54.6688 60.09 62.5H66C79.254 62.5 90 73.6938 90 87.5V125C96.618 125 102 119.394 102 112.5V62.5C102 48.7125 112.764 37.5 126 37.5Z" fill="#BDBDBD"></path> <path opacity="0.3" d="M102 62.5V112.5C102 119.375 96.6 125 90 125V137.5C90.114 137.5 90.36 137.5 90.6 137.437C91.56 137.375 93.426 137.063 95.946 136.688C106.32 133.938 114 124.188 114 112.5V62.5C114 55.625 119.4 50 126 50V37.5C112.74 37.5 102 48.6875 102 62.5ZM48 137.5H60C60 130.625 65.4 125 72 125V112.5C58.74 112.5 48 123.687 48 137.5Z" fill="#000000"></path> </g></svg>
                    Никита
                </button>
            </div>
        </section>
    )
}

export default Welcome;