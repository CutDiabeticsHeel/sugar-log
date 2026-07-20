import { NavLink } from "react-router-dom";
import style from "../css/components/menu.module.css";
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import {useState, useRef} from "react";
import useOutsideClick from "../hooks/close-popup";

function Menu() {
    const [isOpen, setOpen] = useState(false)
    const menuRef = useRef(null);
    useOutsideClick(menuRef, () => setOpen(false));

    return (
        <nav className={`${style.navigationMenu} ${isOpen ? style.openMenu : style.closeMenu}`} ref={menuRef}>
            <span className={style.titleMenu}>
                <span className={style.linkText}>Дневник <br/> сахаров</span>
                <button className={style.buttonMenu} onClick={() => (setOpen(prev => !prev))}>
                    <MenuIcon/>
                </button>
            </span>

            <NavLink to="/" className={({ isActive }) => `${style.navigationItem} ${isActive ? style.navigationItemActive : ""}`}>
                <WaterDropIcon/>
                <span className={style.linkText}>Главная</span>
                <span className={style.linkNumber}>01</span>
            </NavLink>
            <NavLink to="/diary" className={({ isActive }) => `${style.navigationItem} ${isActive ? style.navigationItemActive : ""}`}>
                <ListAltIcon/>
                <span className={style.linkText}>Дневник</span>
                <span className={style.linkNumber}>02</span>
            </NavLink>
            <NavLink to="/graph" className={({ isActive }) => `${style.navigationItem} ${isActive ? style.navigationItemActive : ""}`}>
                <ShowChartIcon/>
                <span className={style.linkText}>Графики</span>
                <span className={style.linkNumber}>03</span>
            </NavLink>
            <NavLink to="/statistics" className={({ isActive }) => `${style.navigationItem} ${isActive ? style.navigationItemActive : ""}`}>
                <BarChartIcon/>
                <span className={style.linkText}>Статистика</span>
                <span className={style.linkNumber}>04</span>
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => `${style.navigationItem} ${isActive ? style.navigationItemActive : ""}`}>
                <RestaurantMenuIcon/>
                <span className={style.linkText}>Продукты</span>
                <span className={style.linkNumber}>05</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `${style.navigationItem} ${isActive ? style.navigationItemActive : ""}`}>
                <PersonIcon/>
                <span className={style.linkText}>Профиль</span>
                <span className={style.linkNumber}>06</span>
            </NavLink>
        </nav>
    )
}

export default Menu;