import { Link } from 'react-router-dom'
import CarritoItem from './Item.jsx'

export default function Lista({ carrito, onCantidad, onEliminar }) {
  return (
    <section className="grid gap-3.5" aria-label="Productos en el carrito">
      {carrito.length === 0 ? (
        <p className="m-0 rounded-[10px] border border-dashed border-[#777] px-6 py-10 text-center text-ink">
          Tu carrito está vacío. <Link to="/productos" className="font-bold text-ink decoration-2 underline-offset-[3px]">Ver catálogo</Link>
        </p>
      ) : (
        carrito.map((item) => (
          <CarritoItem
            key={item.id}
            item={item}
            onCantidad={onCantidad}
            onEliminar={onEliminar}
          />
        ))
      )}
    </section>
  )
}
