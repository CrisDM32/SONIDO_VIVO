import { garantia } from '../data/garantia.js'
import ListaCobertura from '../components/garantia/ListaCobertura.jsx'
import PasosNumerados from '../components/generales/PasosNumerados.jsx'
import BloqueContacto from '../components/generales/BloqueContacto.jsx'
import { contenedorAncho, tituloPagina } from '../styles/clases.js'

export default function Garantia() {
  return (
    <main className={`${contenedorAncho} pb-10`}>
      <h1 className={tituloPagina}>Garantía</h1>
      <p className="mt-0 mb-8 text-center text-[18px] text-[#2a2a2a]">{garantia.introduccion}</p>

      <div className="grid grid-cols-2 items-start gap-6 mobile:grid-cols-1">
        <ListaCobertura titulo="¿Qué cubre?" items={garantia.cubre} incluye />
        <ListaCobertura titulo="¿Qué no cubre?" items={garantia.noCubre} incluye={false} />
      </div>

      <PasosNumerados titulo="¿Cómo hacer válida tu garantía?" pasos={garantia.pasos} />
      <BloqueContacto className="mt-8" titulo="¿Necesitas hacer válida tu garantía?" nota={garantia.nota} />
    </main>
  )
}
