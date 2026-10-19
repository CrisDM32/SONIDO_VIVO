import { useState } from "react";
import { Link } from "react-router-dom";
import {
  obtenerCarrito,
  actualizarCantidad,
  eliminarDelCarrito,
  vaciarCarrito,
  calcularTotalCarrito,
  formatearPrecioCLP,
} from "../utils/carrito";

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

      <div className="carrito-lista">
        {carritoVacio ? (
          <p className="carrito-vacio">
            Tu carrito está vacío. <Link to="/productos">Ver catálogo</Link>
          </p>
        ) : (
          carrito.map((item) => (
            <div className="carrito-item" key={item.id}>
              <div className="carrito-item-icono">{item.icono}</div>

              <div className="carrito-item-info">
                <h3>{item.nombre}</h3>
                <p>{formatearPrecioCLP(item.precio)} c/u</p>
              </div>

              <div className="carrito-item-cantidad">
                <button
                  type="button"
                  className="btn-cantidad"
                  onClick={() => handleCantidad(item.id, item.cantidad - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  className="input-cantidad"
                  value={item.cantidad}
                  min="1"
                  onChange={(evento) =>
                    handleCantidad(item.id, Number(evento.target.value) || 1)
                  }
                />
                <button
                  type="button"
                  className="btn-cantidad"
                  onClick={() => handleCantidad(item.id, item.cantidad + 1)}
                >
                  +
                </button>
              </div>

              <p className="carrito-item-subtotal">
                {formatearPrecioCLP(item.precio * item.cantidad)}
              </p>

              <button
                type="button"
                className="btn-eliminar"
                title="Eliminar producto"
                onClick={() => handleEliminar(item.id)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <section className="carrito-resumen">
        <button type="button" className="boton-secundario" onClick={handleVaciar}>
          Vaciar carrito
        </button>

        <div className="carrito-total-linea">
          <span>Total:</span>
          <span className="carrito-total">{formatearPrecioCLP(total)}</span>
        </div>

        {carritoVacio ? (
          <span className="boton-principal boton-ancho-auto deshabilitado">Ir a pagar</span>
        ) : (
          <Link to="/pago" className="boton-principal boton-ancho-auto">
            Ir a pagar
          </Link>
        )}
      </section>
    </main>
  );
}
