import { Link } from 'react-router-dom'
import { contenedorAncho, enlaceSubrayado, tarjetaClara, tituloPagina } from '../../styles/clases.js'

export default function PedidoVacio() {
  return (
    <main className={`${contenedorAncho} pb-10`}>
      <h1 className={`${tituloPagina} mb-3`}>Sin pedidos recientes</h1>
      <p className={`m-0 ${tarjetaClara} p-7 text-center text-ink`}>
        Todavía no has realizado ninguna compra. <Link to="/productos" className={enlaceSubrayado}>Ver catálogo</Link>
      </p>
    </main>
  )
}
