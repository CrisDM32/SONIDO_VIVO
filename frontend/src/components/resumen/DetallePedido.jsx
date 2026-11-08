import { formatearPrecioCLP } from '../../utils/carrito.js'

function DatosPedido({ numero, fecha }) {
  return (
    <div className="resumen-pedido-datos">
      <p><span>N° de pedido</span><strong>{numero}</strong></p>
      <p><span>Fecha</span><strong>{fecha}</strong></p>
    </div>
  )
}

function ProductosPedido({ items }) {
  return (
    <>
      <h2>Productos</h2>
      {items.map((item) => (
        <div className="resumen-item" key={item.id}>
          <span>{item.icono} {item.nombre} x{item.cantidad}</span>
          <span>{formatearPrecioCLP(item.precio * item.cantidad)}</span>
        </div>
      ))}
    </>
  )
}

function TotalPedido({ total }) {
  return (
    <div className="carrito-total-linea">
      <span>Total pagado:</span>
      <span className="carrito-total">{formatearPrecioCLP(total)}</span>
    </div>
  )
}

export default function DetallePedido({ pedido }) {
  return (
    <section className="resumen-pedido" aria-label="Detalle del pedido">
      <DatosPedido numero={pedido.numero} fecha={pedido.fecha} />
      <ProductosPedido items={pedido.items} />
      <TotalPedido total={pedido.total} />
    </section>
  )
}
