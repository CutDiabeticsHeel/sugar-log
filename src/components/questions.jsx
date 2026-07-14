import {useGetUserQuestionsQuery} from "../store/api";
import EditIcon from '@mui/icons-material/Edit';
import style from "../css/components/questions.module.css";
import {useState} from "react";

function Questions(){
    const {data: userQuestions, isLoading} = useGetUserQuestionsQuery()
    const [popupOpen, setPopupOpen] = useState(false)
    if (isLoading) {
        return (<div>Загрузка...</div>)
    }
    return (
        <div className={style.questionsSection}>
            <p>Вопросы для следующего приема</p>
            <ul className={style.questionList}>
                {userQuestions.map((question) =>(
                    <li key={question.id} className={style.questionItem}>
                        <label className={style.checkboxLabel}>
                            <input type="checkbox" name="question" id={question.id} />
                        </label>
                        {question.question}
                    </li>
                ))}
            </ul>
            <div className={style.buttonContainer}>
                <button className={style.addQuestionSection}>
                    Удалить отмеченные вопросы
                </button>
                <button className={style.addQuestionSection} onClick={() => (setPopupOpen(prev => !prev))}>
                    Добавить вопрос
                    <EditIcon fontSize="small"/>
                </button>
            </div>
            {popupOpen &&
                <form action="">
                    <label className={style.addQuestionForm}>
                        Введите вопрос
                            <input type="text" />
                    </label>
                    <button type="submit" className={style.addQuestion}>Добавить вопрос</button>
                </form>
            }
        </div>
    )
}

export default Questions