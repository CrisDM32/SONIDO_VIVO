import { Link } from 'react-router-dom'
import { formatearPrecioCLP } from '../../utils/carrito.js'
import { botonCarrito } from '../../styles/clases.js'

export default function TarjetaProducto({ producto, agregado, onAgregar }) {
  return (
    <article className="rounded-[10px] bg-button p-[30px] text-center text-paper no-underline transition-transform duration-300 ease-[ease] [overflow-wrap:anywhere] hover:scale-105 tablet:p-[22px] mobile:px-3 mobile:py-4 mini:p-5">
      <Link className="block text-inherit no-underline" to={`/producto/${producto.id}`}>
        {producto.imagenes?.[0] ? (
          <img
            className="mx-auto mb-3 block aspect-square h-auto w-full max-w-full rounded-sv object-cover"
            src={producto.imagenes[0]}
            alt={producto.nombre}
          />
        ) : (
          <div aria-hidden="true">{producto.icono}</div>
        )}
        <p className="text-[13px] tracking-[1px] uppercase opacity-80">{producto.categoria}</p>
        <h2 className="mobile:text-[18px]">{producto.nombre}</h2>
      </Link>
      <p>{formatearPrecioCLP(producto.precio)}</p>
      <p>
        {producto.disponible ? 'En stock' : 'Agotado'}
      </p>
      <button
        type="button"
        className={`${botonCarrito} max-w-full mobile:w-full mobile:px-2 mobile:py-2.5 mobile:text-[14px]`}
        disabled={!producto.disponible}
        onClick={() => onAgregar(producto)}
      >
        {!producto.disponible ? 'Agotado' : agregado ? '¡Agregado! ✓' : 'Agregar al carrito'}
      </button>
    </article>
  )
}
