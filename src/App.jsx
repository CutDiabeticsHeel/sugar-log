import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home";
import MainLayout from "./pages/outlet";
import "./css/main.css";
import Preloader from "./components/preloader";
import useOnlineStatus from "./hooks/useOnlineStatus";
import { apiGet } from "./offline/api";

function ProtectedRoute({ children }) {
    const [authorized, setAuthorized] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("UserID");

        apiGet(`/user-info?id=${userId}`)
            .then(() => setAuthorized(true))
            .catch(() => {
                window.location.replace("/");
            });
    }, []);

    if (authorized === null) return <Preloader />;

    if (!authorized) return <Navigate to="/" replace />;

    return children;
}


const Welcome = lazy(() => import("./pages/welcome"));
const Diary = lazy(() => import("./pages/diary"));
const Charts = lazy(() => import("./pages/graph"));
const Statistics = lazy(() => import("./pages/stats"));
const ProductsPage = lazy(() => import("./pages/products"));
const Profile = lazy(() => import("./pages/profile"));
const CarbInsulinCurve = lazy(() => import("./pages/carbInsulinCurve"));
const Verify = lazy(() => import("./pages/verify"));

function App() {
    const isOnline = useOnlineStatus();

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
                <Route path="/verify" element={<Verify />} />
                <Route element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
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