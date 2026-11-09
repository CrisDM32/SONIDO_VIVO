import { useState } from 'react'
import { useProductos } from '../hooks/useProductos.jsx'
import { agregarAlCarrito } from '../utils/carrito.js'
import BuscadorProductos from '../components/catalogo-productos/BuscadorProductos.jsx'
import ListaProductos from '../components/catalogo-productos/ListaProductos.jsx'

export default function CatalogoProductos({ categoria }) {
  const [busqueda, setBusqueda] = useState('')
  const [agregados, setAgregados] = useState({})
  const { productos, estado } = useProductos()

  const productosFiltrados = productos.filter(
    (producto) =>
      (!categoria || producto.categoria === categoria) &&
      producto.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()),
  )

  const agregarProducto = (producto) => {
    agregarAlCarrito(producto)
    setAgregados((anterior) => ({ ...anterior, [producto.id]: true }))
    setTimeout(() => {
      setAgregados((anterior) => ({ ...anterior, [producto.id]: false }))
    }, 1000)
  }

  return (
    <>
      <BuscadorProductos
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
      />
      <ListaProductos
        productos={productosFiltrados}
        estado={estado}
        agregados={agregados}
        onAgregar={agregarProducto}
      />
    </>
  )
}
