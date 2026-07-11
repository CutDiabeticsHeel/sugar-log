import { Link } from "react-router-dom";
import style from "../css/menu.module.css";
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PersonIcon from '@mui/icons-material/Person';

function Menu() {
    return (
        <nav className={style.navigationMenu}>
            <Link to="/" className={style.navigationItem}><WaterDropIcon/>Главная <span>01</span></Link>
            <Link to="/diary" className={style.navigationItem}><ListAltIcon/>Дневник <span>02</span></Link>
            <Link to="/graph" className={style.navigationItem}><ShowChartIcon/>Графики <span>03</span></Link>
            <Link to="/statistics" className={style.navigationItem}><BarChartIcon/>Статистика <span>04</span></Link>
            <Link to="/products" className={style.navigationItem}><RestaurantMenuIcon/>Продукты <span>05</span></Link>
            <Link to="/profile" className={style.navigationItem}><PersonIcon/>Профиль <span>06</span></Link>
        </nav>
    )
}

export default Menu;