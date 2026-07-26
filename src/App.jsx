import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Menu from "./components/Menu";
import "./css/main.css";
import Preloader from "./components/preloader";

const Diary = lazy(() => import("./pages/diary"));
const Charts = lazy(() => import("./pages/graph"));
const Statistics = lazy(() => import("./pages/stats"));
const ProductsPage = lazy(() => import("./pages/products"));
const Profile = lazy(() => import("./pages/profile"));

function App() {
    return (
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
    );
}

export default App;