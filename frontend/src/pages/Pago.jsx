import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerCarrito,
  vaciarCarrito,
  calcularTotalCarrito,
  formatearPrecioCLP,
} from "../utils/carrito";

const PEDIDO_KEY = "sv_ultimo_pedido";

export default function Pago() {
  const navigate = useNavigate();
  const [carrito] = useState(() => obtenerCarrito()); 
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (carrito.length === 0) {
      navigate("/carrito", { replace: true });
    }
  }, [carrito, navigate]);

  if (carrito.length === 0) {
    return null;
  }

  const total = calcularTotalCarrito(carrito);

  function generarNumeroPedido() {
    const numeroAlAzar = Math.floor(10000 + Math.random() * 90000);
    return "SV-" + numeroAlAzar;
  }

  function handlePagar() {
    setProcesando(true);

    setTimeout(() => {
      const pedido = {
        numero: generarNumeroPedido(),
        fecha: new Date().toLocaleString("es-CL"),
        items: carrito,
        total,
      };

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
