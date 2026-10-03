import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Menu from "./components/Menu";
import "./css/main.css";
import Preloader from "./components/preloader";
import useOnlineStatus from "./hooks/useOnlineStatus";
import { apiGet } from "./offline/api";

const Diary = lazy(() => import("./pages/diary"));
const Charts = lazy(() => import("./pages/graph"));
const Statistics = lazy(() => import("./pages/stats"));
const ProductsPage = lazy(() => import("./pages/products"));
const Profile = lazy(() => import("./pages/profile"));

function App() {
    const isOnline = useOnlineStatus();

    useEffect(() => {
        apiGet('/products').catch(err => console.error('PRODUCTS ERROR:', err));
        apiGet('/user-info').catch(err => console.error('USER INFO ERROR:', err));
    }, []);

    return (
      <div className="App">
        {!isOnline && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000
          }}>
            ⚠️ Нет сети. Показаны сохранённые данные.
          </div>
        )}

        <main className="main">
          <Menu />
          <Suspense fallback={<Preloader/>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/diary" element={<Diary />} />
                <Route path="/graph" element={<Charts />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    );
}

export default App;