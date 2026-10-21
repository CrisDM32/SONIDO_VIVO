import { formatearPrecioCLP } from '../../utils/carrito.js'

export default function Resumen({ total, carritoVacio, onVaciar }) {
  return (
    <section className="carrito-resumen" aria-label="Resumen del carrito">
      <button type="button" className="boton-secundario" onClick={onVaciar}>
        Vaciar carrito
      </button>

      <div className="carrito-total-linea">
        <span>Total:</span>
        <span className="carrito-total">{formatearPrecioCLP(total)}</span>
      </div>

      {carritoVacio ? (
        <span className="boton-principal boton-ancho-auto deshabilitado" aria-disabled="true">
          Ir a pagar
        </span>
      ) : (
        <a href="pago.html" className="boton-principal boton-ancho-auto">
          Ir a pagar
        </a>
      )}
    </section>
  )
}
