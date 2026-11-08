import { formatearPrecioCLP } from '../../utils/carrito.js'
import { lineaTotal, montoTotal, resumenItemClaro, tarjetaClara } from '../../styles/clases.js'

function DatosPedido({ numero, fecha }) {
  const dato = 'm-0 grid gap-1.5 rounded-lg bg-[#efeded] px-4 py-3.5'

  return (
    <div className="mb-[26px] grid grid-cols-2 gap-3.5 mobile:grid-cols-[1fr]">
      <p className={dato}><span className="text-[14px] text-[#555]">N° de pedido</span><strong className="text-[17px]">{numero}</strong></p>
      <p className={dato}><span className="text-[14px] text-[#555]">Fecha</span><strong className="text-[17px]">{fecha}</strong></p>
    </div>
  )
}

function ProductosPedido({ items }) {
  return (
    <>
      <h2 className="m-0 mb-2 text-[22px]">Productos</h2>
      {items.map((item) => (
        <div className={resumenItemClaro} key={item.id}>
          <span>{item.icono} {item.nombre} x{item.cantidad}</span>
          <span>{formatearPrecioCLP(item.precio * item.cantidad)}</span>
        </div>
      ))}
    </>
  )
}

function TotalPedido({ total }) {
  return (
    <div className={`${lineaTotal} pt-2`}>
      <span>Total pagado:</span>
      <span className={montoTotal}>{formatearPrecioCLP(total)}</span>
    </div>
  )
}

export default function DetallePedido({ pedido }) {
  return (
    <section className={`mb-6 ${tarjetaClara} p-7 text-ink mobile:px-4 mobile:py-5`} aria-label="Detalle del pedido">
      <DatosPedido numero={pedido.numero} fecha={pedido.fecha} />
      <ProductosPedido items={pedido.items} />
      <TotalPedido total={pedido.total} />
    </section>
  )
}
