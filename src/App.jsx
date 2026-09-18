import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Brasil from "./pages/Brasil";
import Japao from "./pages/Japao";
import EUA from "./pages/EUA";
import BloodMoon from "./components/BloodMoon";
import Favoritos from "./pages/Favoritos";

export default function App() {
  return (
    <div>
      <BloodMoon />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/brasil" element={<Brasil />} />
        <Route path="/japao" element={<Japao />} />
        <Route path="/eua" element={<EUA />} />
        <Route path="/favoritos" element={<Favoritos />} />
      </Routes>
    </div>
  );
}
