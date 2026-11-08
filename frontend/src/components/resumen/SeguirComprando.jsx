import { Link } from 'react-router-dom'
import { botonPrincipal } from '../../styles/clases.js'

export default function SeguirComprando() {
  return (
    <Link to="/productos" className={`${botonPrincipal} min-w-[190px] mobile:w-full`}>
      Seguir comprando
    </Link>
  )
}
