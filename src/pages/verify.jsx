import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { apiWrite } from "../offline/api";
import style from "../css/pages/verify.module.css";

function Verify() {
    const [code, setCode] = useState(['', '', '', '']);
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isButtonDisabled = code.some(digit => digit === '');
    const inputsRef = useRef([]);
    const buttonRef = useRef();

    const handleOtpChange = (value, index) => {
        const newCode = [...code];
        newCode[index] = value.target.value;
        setCode(newCode);
        if (value && index < 3) {
            inputsRef.current[index + 1].focus();
        }
        if (index === 3) {
            setTimeout(() => {
                buttonRef.current?.focus();
            }, 0);
        }
    };

    const submit = async (value) => {
        try {
            const code = value.join("");
            const res = await apiWrite(
                "POST",
                `/vetify?id=${location.state.userId}`,
                code,
                {userId: location.state.userId}
            )
            if (res?.data?.ok) {
                localStorage.setItem("UserID", location.state.userId);
                navigate("/home", { replace: true });
            } else {
                setShowError(true);
            }
        } catch (err) {
            console.log(err)
            setCode('');
        }
    };

    return (
        <div className={style.registerContainer}>
            <div className={style.digitContainer}>
                {code.map((digit, index) => (
                    <input
                        className={style.digit}
                        key={index}
                        value={digit}
                        onChange={(value) => handleOtpChange(value, index)}
                        ref={el => inputsRef.current[index] = el}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        autoFocus={index === 0}
                    />
                ))}
            </div>
            <button className={style.register} onClick={() => submit(code)} disabled={isButtonDisabled} ref={buttonRef}>Войти</button>
            {showError && (
                    <div className={style.overlay} onClick={() => navigate("/", { replace: true })}>
                        <dialog open>
                            <p>Неверный код</p>
                            <button className={style.navigate} onClick={() => navigate("/", { replace: true })}>ОК</button>
                        </dialog>
                    </div>
                )}
        </div>
    );
}

export default Verify;