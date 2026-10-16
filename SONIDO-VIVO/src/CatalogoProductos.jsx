import { useState } from 'react'
import { productos } from '../js/productos.js'

const formatearPrecio = (precio) =>
  precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })

export default function CatalogoProductos() {
  const [busqueda, setBusqueda] = useState('')
  const [productoAgregado, setProductoAgregado] = useState(null)
  const [error, setError] = useState('')

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()),
  )

  const agregarProducto = (producto) => {
    if (typeof window.agregarAlCarrito !== 'function') {
      setError('No se pudo conectar con el carrito. Recarga la página e inténtalo nuevamente.')
      return
    }

    window.agregarAlCarrito(producto)
    setError('')
    setProductoAgregado(producto.id)
  }

  return (
    <>
      <section className="search-section">
        <input
          id="buscarProducto"
          className="input-buscar"
          type="search"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
      </section>

      <section className="catalogo-grid" aria-label="Lista de productos">
        {productosFiltrados.length === 0 ? (
          <p className="sin-resultados">No se encontraron productos.</p>
        ) : (
          productosFiltrados.map((producto) => (
            <article className="product-item" key={producto.id}>
              <div className="producto-icono" aria-hidden="true">{producto.icono}</div>
              <p className="producto-categoria">{producto.categoria}</p>
              <h2>{producto.nombre}</h2>
              <p className="producto-precio">{formatearPrecio(producto.precio)}</p>
              <p className={`producto-stock ${producto.disponible ? 'disponible' : 'agotado'}`}>
                {producto.disponible ? 'En stock' : 'Agotado'}
              </p>
              <button
                type="button"
                className="carrito-button"
                disabled={!producto.disponible}
                onClick={() => agregarProducto(producto)}
              >
                {!producto.disponible
                  ? 'Agotado'
                  : productoAgregado === producto.id
                    ? '¡Agregado! ✓'
                    : 'Agregar al carrito'}
              </button>
            </article>
          ))
        )}
      </section>
      {error && <p className="sin-resultados" role="alert">{error}</p>}
    </>
  )
}
