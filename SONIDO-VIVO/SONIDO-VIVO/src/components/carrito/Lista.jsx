import CarritoItem from './Item.jsx'

export default function Lista({ carrito, onCantidad, onEliminar }) {
  return (
    <section className="carrito-lista" aria-label="Productos en el carrito">
      {carrito.length === 0 ? (
        <p className="carrito-vacio">
          Tu carrito está vacío. <a href="productos.html">Ver catálogo</a>
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
