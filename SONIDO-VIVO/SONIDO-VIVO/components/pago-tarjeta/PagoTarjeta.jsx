import { useMemo } from 'react'
import {
  calcularTotalCarrito,
  formatearPrecioCLP,
  obtenerCarrito,
  vaciarCarrito,
} from '../../utils/carrito.js'

const PEDIDO_KEY = 'sv_ultimo_pedido'

function crearPedido(carrito, total) {
  return {
    numero: `SV-${Math.floor(10000 + Math.random() * 90000)}`,
    fecha: new Date().toLocaleString('es-CL'),
    items: carrito,
    total,
  }
}

export default function PagoTarjeta() {
  const carrito = useMemo(() => obtenerCarrito(), [])
  const total = calcularTotalCarrito(carrito)

  function handleSubmit(evento) {
    evento.preventDefault()

    if (carrito.length === 0) {
      return
    }

    localStorage.setItem(PEDIDO_KEY, JSON.stringify(crearPedido(carrito, total)))
    vaciarCarrito()
    window.location.assign('resumen.html')
  }

  return (
    <main className="contenedor-ancho checkout-page">
      <h1 className="section-title-productos">Pago con tarjeta</h1>

      <div className="checkout-layout">
        <section className="checkout-card">
          <h2>Datos de pago</h2>
          <p>Ingresa los datos del titular y de la tarjeta.</p>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="campo">
              <label htmlFor="nombreTitular">Nombre del titular</label>
              <input
                id="nombreTitular"
                name="nombreTitular"
                type="text"
                autoComplete="cc-name"
                placeholder="Como aparece en la tarjeta"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="numeroTarjeta">Número de tarjeta</label>
              <input
                id="numeroTarjeta"
                name="numeroTarjeta"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                pattern="[0-9 ]{13,23}"
                maxLength={23}
                required
              />
            </div>

            <div className="campo-fila">
              <div className="campo">
                <label htmlFor="fechaVencimiento">Fecha de vencimiento</label>
                <input
                  id="fechaVencimiento"
                  name="fechaVencimiento"
                  type="month"
                  autoComplete="cc-exp"
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="ccv">CCV</label>
                <input
                  id="ccv"
                  name="ccv"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  pattern="[0-9]{3,4}"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="boton-principal boton-ancho-auto"
              disabled={carrito.length === 0}
            >
              Pagar {formatearPrecioCLP(total)}
            </button>

            {carrito.length === 0 && (
              <p className="resumen-vacio" role="status">
                Agrega productos al carrito antes de pagar. <a href="productos.html">Ver catálogo</a>
              </p>
            )}
            <p className="resumen-vacio">
              Pago de demostración: no se enviará ni almacenará información de la tarjeta.
            </p>
          </form>
        </section>

        <aside className="checkout-card resumen-card">
          <h2>Resumen del pedido</h2>

          {carrito.length === 0 ? (
            <p className="resumen-vacio">Tu carrito está vacío.</p>
          ) : (
            <>
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
            </>
          )}
        </aside>
      </div>
    </main>
  )
}
