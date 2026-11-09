import { useRef, useState } from 'react'
import { useProductos } from '../hooks/useProductos.jsx'
import { agregarAlCarrito } from '../utils/carrito.js'
import { paginar, TAMANO_INICIAL } from '../utils/paginacion.js'
import BuscadorProductos from '../components/catalogo-productos/BuscadorProductos.jsx'
import ListaProductos from '../components/catalogo-productos/ListaProductos.jsx'
import NavegacionPaginas from '../components/catalogo-productos/NavegacionPaginas.jsx'
import PanelPaginacion from '../components/catalogo-productos/PanelPaginacion.jsx'

export default function CatalogoProductos({ categoria }) {
  const [busqueda, setBusqueda] = useState('')
  const [agregados, setAgregados] = useState({})
  const [tamano, setTamano] = useState(TAMANO_INICIAL)
  const [paginaSolicitada, setPaginaSolicitada] = useState(1)
  const inicioRef = useRef(null)
  const { productos, estado } = useProductos()

  const productosFiltrados = productos.filter(
    (producto) =>
      (!categoria || producto.categoria === categoria) &&
      producto.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()),
  )
  const { items, total, totalPaginas, pagina, desde, hasta } = paginar(productosFiltrados, paginaSolicitada, tamano)

  const agregarProducto = (producto) => {
    agregarAlCarrito(producto)
    setAgregados((anterior) => ({ ...anterior, [producto.id]: true }))
    setTimeout(() => {
      setAgregados((anterior) => ({ ...anterior, [producto.id]: false }))
    }, 1000)
  }

  // Cualquier cambio en lo que se ve (búsqueda, cantidad por página) vuelve a la primera página.
  const cambiarBusqueda = (texto) => {
    setBusqueda(texto)
    setPaginaSolicitada(1)
  }

  const cambiarTamano = (nuevoTamano) => {
    setTamano(nuevoTamano)
    setPaginaSolicitada(1)
  }

  const cambiarPagina = (nuevaPagina) => {
    setPaginaSolicitada(nuevaPagina)
    inicioRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <BuscadorProductos
        busqueda={busqueda}
        onBusquedaChange={cambiarBusqueda}
      />
      <div ref={inicioRef}>
        {estado === 'SUCCESS' && total > 0 && (
          <PanelPaginacion tamano={tamano} onTamanoChange={cambiarTamano} desde={desde} hasta={hasta} total={total} />
        )}
      </div>
      <ListaProductos
        productos={items}
        estado={estado}
        agregados={agregados}
        onAgregar={agregarProducto}
      />
      {estado === 'SUCCESS' && (
        <NavegacionPaginas pagina={pagina} totalPaginas={totalPaginas} onCambiar={cambiarPagina} />
      )}
    </>
  )
}
