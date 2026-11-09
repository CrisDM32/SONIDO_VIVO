import { terminosCondiciones } from '../data/terminosCondiciones.js'
import IndiceTerminos from '../components/terminos/IndiceTerminos.jsx'
import SeccionTermino from '../components/terminos/SeccionTermino.jsx'
import { contenedorAncho, tituloPagina } from '../styles/clases.js'

export default function TerminosCondiciones() {
  const { introduccion, secciones } = terminosCondiciones

  return (
    <main className={`${contenedorAncho} pb-10`}>
      <h1 className={tituloPagina}>Términos y condiciones</h1>
      <p className="mt-0 mb-8 text-center text-[18px] text-[#2a2a2a]">{introduccion}</p>

      <IndiceTerminos secciones={secciones} />

      <div className="grid gap-4">
        {secciones.map((seccion, indice) => (
          <SeccionTermino
            key={seccion.id}
            id={seccion.id}
            numero={indice + 1}
            titulo={seccion.titulo}
            parrafos={seccion.parrafos}
          />
        ))}
      </div>
    </main>
  )
}
