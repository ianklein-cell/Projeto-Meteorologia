import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Brasil from "./pages/Brasil";
import Japao from "./pages/Japao";
import EUA from "./pages/EUA";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/brasil" element={<Brasil />} />
      <Route path="/japao" element={<Japao />} />
      <Route path="/eua" element={<EUA />} />
    </Routes>
  );
}