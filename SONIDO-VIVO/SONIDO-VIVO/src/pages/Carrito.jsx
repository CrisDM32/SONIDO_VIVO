import { useState } from "react";
import {
  obtenerCarrito,
  actualizarCantidad,
  eliminarDelCarrito,
  vaciarCarrito,
  calcularTotalCarrito,
} from "../utils/carrito.js";
import CarritoLista from "../components/carrito/Lista.jsx";
import CarritoResumen from "../components/carrito/Resumen.jsx";

export default function Carrito() {
  const [carrito, setCarrito] = useState(() => obtenerCarrito());

  function handleCantidad(id, cantidad) {
    setCarrito(actualizarCantidad(carrito, id, cantidad));
  }

  function handleEliminar(id) {
    setCarrito(eliminarDelCarrito(carrito, id));
  }

  function handleVaciar() {
    setCarrito(vaciarCarrito());
  }

  const total = calcularTotalCarrito(carrito);
  const carritoVacio = carrito.length === 0;

  return (
    <main className="contenedor-ancho">
      <h1 className="section-title-productos">Mi carrito</h1>
      <CarritoLista
        carrito={carrito}
        onCantidad={handleCantidad}
        onEliminar={handleEliminar}
      />
      <CarritoResumen
        total={total}
        carritoVacio={carritoVacio}
        onVaciar={handleVaciar}
      />
    </main>
  );
}
