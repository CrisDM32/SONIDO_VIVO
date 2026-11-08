import { Link } from 'react-router-dom'
import { formatearPrecioCLP } from '../../utils/carrito.js'
import {
  botonPrincipal,
  botonPrincipalDeshabilitado,
  botonSecundario,
  lineaTotal,
  montoTotal,
} from '../../styles/clases.js'

export default function Resumen({ total, carritoVacio, onVaciar }) {
  return (
    <section className="mt-6 grid grid-cols-[1fr_auto_auto] items-center gap-5 rounded-[10px] bg-button px-6 py-[22px] text-paper mobile:grid-cols-[1fr] mobile:gap-3 mobile:p-4" aria-label="Resumen del carrito">
      <button type="button" className={`${botonSecundario} mobile:w-full`} onClick={onVaciar}>
        Vaciar carrito
      </button>

      <div className={lineaTotal}>
        <span>Total:</span>
        <span className={montoTotal}>{formatearPrecioCLP(total)}</span>
      </div>

      {carritoVacio ? (
        <span className={`${botonPrincipalDeshabilitado} mobile:w-full`} aria-disabled="true">
          Ir a pagar
        </span>
      ) : (
        <Link to="/pago" className={`${botonPrincipal} mobile:w-full`}>
          Ir a pagar
        </Link>
      )}
    </section>
  )
}
