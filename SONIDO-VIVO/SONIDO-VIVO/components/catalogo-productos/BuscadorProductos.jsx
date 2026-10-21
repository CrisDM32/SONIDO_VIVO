export default function BuscadorProductos({ busqueda, onBusquedaChange }) {
  return (
    <section className="search-section" role="search">
      <input
        id="buscarProducto"
        className="input-buscar"
        type="search"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(evento) => onBusquedaChange(evento.target.value)}
        aria-label="Buscar productos por nombre"
      />
    </section>
  )
}
