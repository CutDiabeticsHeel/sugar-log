import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";
import Preloader from "../components/preloader";
import { apiGet } from "../offline/api";

export default function MainLayout() {
    useEffect(() => {
        const userId = localStorage.getItem("UserID");
        apiGet('/products').catch(err => console.error('PRODUCTS ERROR:', err));
        apiGet(`/user-info?id=${userId}`).catch(err => console.error('USER INFO ERROR:', err));
    }, []);
    
    return (
        <main className="main">
            <Menu />
            <Suspense fallback={<Preloader />}>
                <Outlet />
            </Suspense>
        </main>
    );
}