import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Diary from "./pages/diary";
import Charts from "./pages/graph";
import Statistics from "./pages/stats";
import Products from "./pages/products";
import Profile from "./pages/profile";
import Menu from "./components/Menu";

function App() {
    return (
        <>
          <Menu />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/graph" element={<Charts />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/products" element={<Products />} />
              <Route path="/profile" element={<Profile />} />
          </Routes>
        </>
    );
}

export default App;