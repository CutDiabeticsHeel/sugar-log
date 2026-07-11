import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Diary from "./pages/diary";
import Charts from "./pages/graph";
import Statistics from "./pages/stats";
import ProductsPage from "./pages/products";
import Profile from "./pages/profile";
import Menu from "./components/Menu";
import "./css/main.css"

function App() {
    return (
        <main className="main">
          <Menu />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/graph" element={<Charts />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
    );
}

export default App;