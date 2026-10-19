import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Registro from "./pages/Registro";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Pago from "./pages/Pago";
import Resumen from "./pages/Resumen";
export default function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<Navigate to="/productos" replace />} />

        <Route path="/registro" element={<Registro />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/pago" element={<Pago />} />
        <Route path="/resumen" element={<Resumen />} />
      </Routes>
    </>
  );
}
