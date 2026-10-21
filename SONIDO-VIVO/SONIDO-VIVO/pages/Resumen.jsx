import { useState } from 'react'
import ConfirmacionPedido from '../components/resumen/ConfirmacionPedido.jsx'
import DetallePedido from '../components/resumen/DetallePedido.jsx'
import PedidoVacio from '../components/resumen/PedidoVacio.jsx'
import SeguirComprando from '../components/resumen/SeguirComprando.jsx'

const PEDIDO_KEY = 'sv_ultimo_pedido'

export default function Resumen() {
  const [pedido] = useState(() => {
    const datos = localStorage.getItem(PEDIDO_KEY)
    return datos ? JSON.parse(datos) : null
  })

  if (!pedido) {
    return <PedidoVacio />
  }

  return (
    <main className="contenedor-ancho resumen-pagina">
      <ConfirmacionPedido />
      <DetallePedido pedido={pedido} />
      <SeguirComprando />
    </main>
  )
}
