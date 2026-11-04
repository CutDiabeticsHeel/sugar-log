import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import MainLayout from "./pages/outlet";
import "./css/main.css";
import Preloader from "./components/preloader";
import useOnlineStatus from "./hooks/useOnlineStatus";
import { apiGet } from "./offline/api";

const Welcome = lazy(() => import("./pages/welcome"));
const Diary = lazy(() => import("./pages/diary"));
const Charts = lazy(() => import("./pages/graph"));
const Statistics = lazy(() => import("./pages/stats"));
const ProductsPage = lazy(() => import("./pages/products"));
const Profile = lazy(() => import("./pages/profile"));
const CarbInsulinCurve = lazy(() => import("./pages/carbInsulinCurve"));

function App() {
    const isOnline = useOnlineStatus();

    useEffect(() => {
        const userId = localStorage.getItem("UserID");
        apiGet('/products').catch(err => console.error('PRODUCTS ERROR:', err));
        apiGet(`/user-info?id=${userId}`).catch(err => console.error('USER INFO ERROR:', err));
    }, []);

    return (
        <div className="App">
            {!isOnline && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px',
                    backgroundColor: "#FDECEA", padding: "20px",
                    borderRadius: "20px", zIndex: 1000
                }}>
                    Нет сети. Работа в оффлайн.
                </div>
            )}
            <Routes>
                <Route
                    path="/"
                    element={
                        <Suspense fallback={<Preloader />}>
                            <Welcome />
                        </Suspense>
                    }
                />
                <Route element={<MainLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/diary" element={<Diary />} />
                    <Route path="/graph" element={<Charts />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/InSug-curve" element={<CarbInsulinCurve />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;