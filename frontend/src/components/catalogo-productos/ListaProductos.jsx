import TarjetaProducto from './TarjetaProducto.jsx'
import { useProductos } from '../../hooks/useProductos.jsx'

export default function ListaProductos({ productos, agregados, onAgregar }) {
  const { estado } = useProductos();
  
  if (productos.length === 0) {
    return (
      <p role="status">
        No se encontraron productos.
      </p>
    )
  }

  return (
    <section className="mb-[50px] grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-5 *:min-w-0 mobile:grid-cols-2 mobile:gap-3 mini:grid-cols-1" aria-label="Lista de productos">
      {estado === 'LOADING' && <>Cargando...</>}
      {estado === 'ERROR' && <p>No se han cargado los productos</p>}
      
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
