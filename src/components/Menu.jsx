import { Link } from "react-router-dom";

function Menu() {
    return (
        <nav>
            <Link to="/">Главная</Link>
            <Link to="/diary">Дневник</Link>
            <Link to="/graph">Графики</Link>
            <Link to="/statistics">Статистика</Link>
            <Link to="/products">Продукты</Link>
            <Link to="/profile">Профиль</Link>
        </nav>
    )
}

export default Menu;