import { inputBuscar } from '../../styles/clases.js'

export default function BuscadorProductos({ busqueda, onBusquedaChange }) {
  return (
    <section className="my-[5%] flex items-center justify-center bg-page px-4 py-[5px] mobile:mt-4 mobile:mb-6" role="search">
      <input
        id="buscarProducto"
        className={inputBuscar}
        type="search"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(evento) => onBusquedaChange(evento.target.value)}
        aria-label="Buscar productos por nombre"
      />
    </section>
  )
}
