import { formatearPrecioCLP } from '../../utils/carrito.js'

export default function InfoProducto({ producto }) {
  return (
    <>
      <p className="m-0 text-[13px] tracking-[1px] uppercase opacity-80">{producto.categoria}</p>
      <h1 className="m-0 text-[36px] mobile:text-[28px]">{producto.nombre}</h1>
      <p className="m-0 text-[14px] opacity-80">Código: {producto.codigo}</p>
      <p className="m-0 text-[32px] font-bold">{formatearPrecioCLP(producto.precio)}</p>
      <p className="m-0">
        {producto.disponible ? 'En stock' : 'Agotado'}
      </p>
      <p className="m-0 leading-[1.6]">{producto.descripcion}</p>
    </>
  )
}
