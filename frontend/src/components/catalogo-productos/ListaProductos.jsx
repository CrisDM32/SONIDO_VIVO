import TarjetaProducto from './TarjetaProducto.jsx'
import { useProductos } from '../../hooks/useProductos.jsx'

export default function ListaProductos({ productos, agregados, onAgregar }) {
  const {producto, estado} = useProductos();
  
  if (productos.length === 0) {
    return (
      <p className="sin-resultados" role="status">
        No se encontraron productos.
      </p>
    )
  }

  return (
    <section className="catalogo-grid" aria-label="Lista de productos">
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
