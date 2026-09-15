<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Brasil from "./pages/Brasil";
import Japao from "./pages/Japao";
import EUA from "./pages/EUA";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/brasil" element={<Brasil />}></Route>
        <Route path="/japao" element={<Japao />}></Route>
        <Route path="/eua" element={<EUA />}></Route>
      </Routes>
    </BrowserRouter>
  );
=======
export default function App() {
  return (
    <div>App</div>
  )
>>>>>>> 50b422dc93cb7670f389bcbf75b38efa75de2a1a
}
