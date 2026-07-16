import { Link } from "react-router-dom";
import style from "../css/components/menu.module.css";
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from "react";

function Menu() {
    const [isOpen, setOpen] = useState(true)

    return (
        <nav className={`${style.navigationMenu} ${isOpen ? style.openMenu : style.closeMenu}`}>
            <span className={style.titleMenu}>
                <span className={style.linkText}>Дневник <br/> сахаров</span>
                <button className={style.buttonMenu} onClick={() => (setOpen(prev => !prev))}>
                    <MenuIcon/>
                </button>
            </span>

            <Link to="/" className={style.navigationItem}>
                <WaterDropIcon/>
                <span className={style.linkText}>Главная</span>
                <span className={style.linkNumber}>01</span>
            </Link>
            <Link to="/diary" className={style.navigationItem}>
                <ListAltIcon/>
                <span className={style.linkText}>Дневник</span>
                <span className={style.linkNumber}>02</span>
            </Link>
            <Link to="/graph" className={style.navigationItem}>
                <ShowChartIcon/>
                <span className={style.linkText}>Графики</span>
                <span className={style.linkNumber}>03</span>
            </Link>
            <Link to="/statistics" className={style.navigationItem}>
                <BarChartIcon/>
                <span className={style.linkText}>Статистика</span>
                <span className={style.linkNumber}>04</span>
            </Link>
            <Link to="/products" className={style.navigationItem}>
                <RestaurantMenuIcon/>
                <span className={style.linkText}>Продукты</span>
                <span className={style.linkNumber}>05</span>
            </Link>
            <Link to="/profile" className={style.navigationItem}>
                <PersonIcon/>
                <span className={style.linkText}>Профиль</span>
                <span className={style.linkNumber}>06</span>
            </Link>
        </nav>
    )
}

export default Menu;