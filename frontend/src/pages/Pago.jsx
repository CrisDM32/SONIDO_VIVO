import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerCarrito,
  vaciarCarrito,
  calcularTotalCarrito,
  formatearPrecioCLP,
} from "../utils/carrito";

const PEDIDO_KEY = "sv_ultimo_pedido";

/* ==========================================================================
   Pago - SOLO SIMULACIÓN (antes: pago.html + js/pago.js)
   Sigue sin conectarse a ninguna pasarela real y sin validar ningún
   dato de la tarjeta: el formulario de abajo es puramente decorativo,
   igual que en la versión HTML (sus valores nunca se leen).

   Diferencia clave: antes, si el carrito llegaba vacío, se hacía
   window.location.href = "carrito.html" en cualquier parte del script.
   En React, "navegar a otra ruta" es un efecto secundario y debe ir
   dentro de useEffect — no se puede llamar a navigate() directamente
   en medio de un render, porque React todavía está pintando el
   componente en ese momento.
   ========================================================================== */

export default function Pago() {
  const navigate = useNavigate();
  const [carrito] = useState(() => obtenerCarrito()); 
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (carrito.length === 0) {
      navigate("/carrito", { replace: true });
    }
  }, [carrito, navigate]);

  // Mientras useEffect redirige (ocurre después de este primer render),
  // no mostramos el formulario de pago de un carrito vacío.
  if (carrito.length === 0) {
    return null;
  }

  const total = calcularTotalCarrito(carrito);

  // Número de pedido ficticio, solo para que el comprobante final
  // se vea como uno real (ej: SV-48213).
  function generarNumeroPedido() {
    const numeroAlAzar = Math.floor(10000 + Math.random() * 90000);
    return "SV-" + numeroAlAzar;
  }

  // La "simulación": nunca llama a ningún banco. Solo bloquea el botón,
  // espera 1.5 segundos como si estuviera procesando (setTimeout) y
  // SIEMPRE aprueba la compra.
  function handlePagar() {
    setProcesando(true);

    setTimeout(() => {
      const pedido = {
        numero: generarNumeroPedido(),
        fecha: new Date().toLocaleString("es-CL"),
        items: carrito,
        total,
      };

      // Antes de vaciar el carrito dejamos una copia de la compra en
      // localStorage, para que la página de Resumen pueda mostrar
      // "qué se compró" aunque el carrito original ya esté vacío.
      localStorage.setItem(PEDIDO_KEY, JSON.stringify(pedido));
      vaciarCarrito();
      navigate("/resumen");
    }, 1500);
  }

  return (
    <main className="contenedor-ancho">
      <h1 className="section-title-productos">Pagar pedido</h1>

      <p className="aviso-simulacion">
        ⚠️ Esto es una simulación. No se procesa ningún pago real ni se
        verifican los datos de la tarjeta.
      </p>

      <div className="pago-layout">
        <section className="resumen-pedido">
          <h2>Resumen</h2>

          {carrito.map((item) => (
            <div className="resumen-item" key={item.id}>
              <span>{item.icono} {item.nombre} x{item.cantidad}</span>
              <span>{formatearPrecioCLP(item.precio * item.cantidad)}</span>
            </div>
          ))}

          <div className="carrito-total-linea">
            <span>Total a pagar:</span>
            <span className="carrito-total">{formatearPrecioCLP(total)}</span>
          </div>
        </section>

        <section>
          <h2>Datos de la tarjeta (simulados)</h2>

          {/* Campos sin "value"/"onChange" a propósito: son inputs no
              controlados, porque igual que en la versión HTML, nunca se
              leen ni se validan. Solo están ahí para que se vea como un
              formulario de pago real. */}
          <form onSubmit={(evento) => evento.preventDefault()}>
            <div className="campo">
              <label htmlFor="nombreTitular">Nombre del titular</label>
              <input type="text" id="nombreTitular" placeholder="Como aparece en la tarjeta" />
            </div>

            <div className="campo">
              <label htmlFor="numeroTarjeta">Número de tarjeta</label>
              <input type="text" id="numeroTarjeta" placeholder="4111 1111 1111 1111" maxLength={19} />
            </div>

            <div className="campo-fila">
              <div className="campo">
                <label htmlFor="vencimiento">Vencimiento</label>
                <input type="text" id="vencimiento" placeholder="MM/AA" maxLength={5} />
              </div>

              <div className="campo">
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" placeholder="123" maxLength={4} />
              </div>
            </div>

            <button
              type="button"
              className="boton-principal"
              onClick={handlePagar}
              disabled={procesando}
            >
              Pagar ahora
            </button>

            {procesando && <p className="pago-procesando">Procesando pago...</p>}
          </form>
        </section>
      </div>
    </main>
  );
}
