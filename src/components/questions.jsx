import {useGetUserQuestionsQuery} from "../store/api";
import EditIcon from '@mui/icons-material/Edit';
import style from "../css/components/questions.module.css";
import {useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm} from "react-hook-form"

const wrapperVariants = {
    closed: {
        height: 0,
        padding: 0,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeOut" }
    },
    open: {
        height: "auto",
        opacity: 1,
        transition: {
            height: {
                duration: 0.3,
                ease: "easeOut"
            },
            opacity: {
                duration: 0.3,
                ease: "easeOut",
                delay: 0.20
            }
        }
    }
};

function Questions(){
    const {data: userQuestions, isLoading, refetch} = useGetUserQuestionsQuery()
    const [popupOpen, setPopupOpen] = useState(false)
    const { register, handleSubmit, reset } = useForm();
    const [selectedIds, setSelectedIds] = useState([]);

    if (isLoading) {
        return (<div>Загрузка...</div>)
    }
    const toggleQuestion = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
        );
    };
    const deleteQuestion = async () => {
        const response = await fetch("http://localhost:5000/api/delete-question", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ ids: selectedIds })
        })
        setSelectedIds([]);
        refetch();
    }
    const addQuestion = async (data) => {
        const response = await fetch("http://localhost:5000/api/add-question", {
            method: "post",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(data)
        })
        reset();
        refetch();
    }
    console.log(userQuestions.length)
    return (
        <div className={style.questionsSection}>
            <p>Вопросы для следующего приема</p>
            <ul className={style.questionList}>
                { userQuestions.length === 0 ?
                <li className={style.zeroQuestions}>Вопросов для обсуждения нет</li>
                :
                userQuestions.map((question) => (
                    <li key={question.id} className={style.questionItem}>
                        <label className={style.checkboxLabel}>
                            <input type="checkbox" name="question" id={question.id} checked={selectedIds.includes(question.id)} onChange={() => toggleQuestion(question.id)}/>
                        </label>
                        {question.question}
                    </li>
                ))}
            </ul>
            <div className={style.buttonContainer}>
                <button className={style.addQuestionSection} onClick={deleteQuestion}>
                    Удалить отмеченные вопросы
                </button>
                <button className={style.addQuestionSection} onClick={() => (setPopupOpen(prev => !prev))}>
                    Добавить вопрос
                    <EditIcon fontSize="small"/>
                </button>
            </div>
            <AnimatePresence>
                {popupOpen &&
                    <motion.form onSubmit={handleSubmit(addQuestion)} autoComplete="off" initial="closed" animate="open" exit="closed" variants={wrapperVariants}>
                        <label className={style.addQuestionForm}>
                            Введите вопрос
                                <input type="text" name="question"  {...register("question")}/>
                        </label>
                        <button type="submit" className={style.addQuestion}>Добавить вопрос</button>
                    </motion.form>
                }
            </AnimatePresence>
        </div>
    )
}

export default Questions