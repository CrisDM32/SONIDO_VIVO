import { formatearPrecioCLP } from '../../utils/carrito.js'

export default function ResumenPedido({ carrito, total }) {
  return (
    <aside className="checkout-card resumen-card">
      <h2>Resumen del pedido</h2>

      {carrito.length === 0 ? (
        <p className="resumen-vacio">Tu carrito está vacío.</p>
      ) : (
        <>
          {carrito.map((item) => (
            <div className="resumen-item" key={item.id}>
              <span>
                {item.icono} {item.nombre} x{item.cantidad}
              </span>
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
  )
}
