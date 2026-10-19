import { useState } from "react";
import { Link } from "react-router-dom";

const PEDIDO_KEY = "sv_ultimo_pedido";

export default function Resumen() {
  const [pedido] = useState(() => {
    const datos = localStorage.getItem(PEDIDO_KEY);
    return datos ? JSON.parse(datos) : null;
  });

  if (!pedido) {
    return (
      <main className="contenedor-ancho">
        <h1 className="section-title-productos">Sin pedidos recientes</h1>
        <p className="resumen-vacio">
          Todavía no has realizado ninguna compra. <Link to="/productos">Ver catálogo</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="contenedor-ancho">
      <h1 className="section-title-productos">¡Compra realizada! ✅</h1>

      <section className="resumen-pedido">
        <p><strong>N° de pedido:</strong> {pedido.numero}</p>
        <p><strong>Fecha:</strong> {pedido.fecha}</p>

        <h2>Productos</h2>
        {pedido.items.map((item) => (
          <div className="resumen-item" key={item.id}>
            <span>{item.icono} {item.nombre} x{item.cantidad}</span>
            <span>
              {(item.precio * item.cantidad).toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </span>
          </div>
        ))}

        <div className="carrito-total-linea">
          <span>Total pagado:</span>
          <span className="carrito-total">
            {pedido.total.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
          </span>
        </div>
      </section>

      <Link to="/productos" className="boton-principal boton-ancho-auto">
        Seguir comprando
      </Link>
    </main>
  );
}
