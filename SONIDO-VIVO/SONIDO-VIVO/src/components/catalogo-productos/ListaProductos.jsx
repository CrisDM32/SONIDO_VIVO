import TarjetaProducto from './TarjetaProducto.jsx'

export default function ListaProductos({ productos, agregados, onAgregar }) {
  if (productos.length === 0) {
    return (
      <p className="sin-resultados" role="status">
        No se encontraron productos.
      </p>
    )
  }

  return (
    <section className="catalogo-grid" aria-label="Lista de productos">
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.id}
          producto={producto}
          agregado={Boolean(agregados[producto.id])}
          onAgregar={onAgregar}
        />
      ))}
    </section>
  )
}
