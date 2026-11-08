import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { productos } from '../data/productos.js'
import { agregarAlCarrito } from '../utils/carrito.js'
import GaleriaProducto from '../components/producto/GaleriaProducto.jsx'
import InfoProducto from '../components/producto/InfoProducto.jsx'
import BotonAgregarProducto from '../components/producto/BotonAgregarProducto.jsx'
import ProductoNoEncontrado from '../components/producto/ProductoNoEncontrado.jsx'
import { contenedorAncho } from '../styles/clases.js'

export default function Producto() {
  const { id: idParam } = useParams()
  const id = Number(idParam)
  const producto = productos.find((p) => p.id === id)
  const [agregado, setAgregado] = useState(false)

  if (!producto) {
    return (
      <main className={contenedorAncho}>
        <ProductoNoEncontrado />
      </main>
    )
  }

  const agregarProducto = () => {
    agregarAlCarrito(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1000)
  }

  return (
    <main className={contenedorAncho}>
      <Link className="mb-4 inline-block font-semibold text-ink underline" to="/productos">← Volver a productos</Link>

      <article className="grid grid-cols-[1fr_1fr] gap-8 rounded-[10px] bg-button p-8 text-paper mobile:grid-cols-[1fr] mobile:gap-5 mobile:p-5">
        <GaleriaProducto
          imagenes={producto.imagenes}
          nombre={producto.nombre}
          icono={producto.icono}
        />

        <div className="flex flex-col items-start gap-3">
          <InfoProducto producto={producto} />
          <BotonAgregarProducto
            disponible={producto.disponible}
            agregado={agregado}
            onAgregar={agregarProducto}
          />
        </div>
      </article>
    </main>
  )
}
