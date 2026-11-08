import { Link } from 'react-router-dom'
import { tituloPagina } from '../../styles/clases.js'

export default function ProductoNoEncontrado() {
  return (
    <>
      <h1 className={tituloPagina}>Producto no encontrado</h1>
      <p className="text-center">
        El producto que buscas no existe.{' '}
        <Link to="/productos">Volver a productos</Link>
      </p>
    </>
  )
}
