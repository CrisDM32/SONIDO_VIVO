import { Link } from 'react-router-dom'
import DetallePedido from '../resumen/DetallePedido.jsx'
import { formatearPrecioCLP } from '../../utils/carrito.js'
import { resumenVacio, tarjetaClara } from '../../styles/clases.js'

export default function HistorialPedidos({ pedidos }) {
  return (
    <section className={`${tarjetaClara} p-7 text-ink mobile:px-4 mobile:py-5`} aria-labelledby="perfil-pedidos">
      <h2 id="perfil-pedidos" className="mt-0 mb-4 text-[24px]">Mis pedidos</h2>

      {pedidos.length === 0 ? (
        <p className={resumenVacio}>
          Aún no tienes pedidos. <Link to="/productos" className="font-semibold underline">Ver catálogo</Link>
        </p>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0">
          {pedidos.map((pedido) => (
            <li key={pedido.numero}>
              <details className="rounded-lg border border-[rgb(18_18_18/14%)] bg-[#faf9f9]">
                <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3.5">
                  <span className="font-bold">{pedido.numero}</span>
                  <span className="text-[#555]">{pedido.fecha}</span>
                  <span className="font-bold">{formatearPrecioCLP(pedido.total)}</span>
                </summary>
                <div className="px-4 pb-4">
                  <DetallePedido pedido={pedido} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
