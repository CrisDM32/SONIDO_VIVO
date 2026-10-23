import { useState } from 'react'
import { productos } from '../data/productos.js'
import { agregarAlCarrito } from '../utils/carrito.js'
import BuscadorProductos from '../components/catalogo-productos/BuscadorProductos.jsx'
import ListaProductos from '../components/catalogo-productos/ListaProductos.jsx'

export default function CatalogoProductos() {
  const [busqueda, setBusqueda] = useState('')
  const [agregados, setAgregados] = useState({})

  const productosFiltrados = productos.filter((producto) =>
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
        agregados={agregados}
        onAgregar={agregarProducto}
      />
    </>
  )
}
