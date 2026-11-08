import { formatearPrecioCLP } from '../../utils/carrito.js'
import {
  lineaTotal,
  montoTotal,
  resumenItemOscuro,
  resumenVacio,
  tarjetaCheckoutOscura,
  tituloTarjetaOscura,
} from '../../styles/clases.js'

export default function ResumenPedido({ carrito, total }) {
  return (
    <aside className={tarjetaCheckoutOscura}>
      <h2 className={tituloTarjetaOscura}>Resumen del pedido</h2>

      {carrito.length === 0 ? (
        <p className={resumenVacio}>Tu carrito está vacío.</p>
      ) : (
        <>
          {carrito.map((item) => (
            <div className={resumenItemOscuro} key={item.id}>
              <span>
                {item.icono} {item.nombre} x{item.cantidad}
              </span>
              <span>{formatearPrecioCLP(item.precio * item.cantidad)}</span>
            </div>
          ))}

          <div className={lineaTotal}>
            <span>Total a pagar:</span>
            <span className={montoTotal}>{formatearPrecioCLP(total)}</span>
          </div>
        </>
      )}
    </aside>
  )
}
