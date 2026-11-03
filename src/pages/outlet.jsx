import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";
import Preloader from "../components/preloader";

export default function MainLayout() {
    return (
        <main className="main">
            <Menu />
            <Suspense fallback={<Preloader />}>
                <Outlet />
            </Suspense>
        </main>
    );
}