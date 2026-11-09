import { politicasPrivacidad } from '../data/politicasPrivacidad.js'
import IndiceTerminos from '../components/terminos/IndiceTerminos.jsx'
import SeccionTermino from '../components/terminos/SeccionTermino.jsx'
import { contenedorAncho, tituloPagina } from '../styles/clases.js'

const PREFIJO = 'privacidad'

export default function PoliticasPrivacidad() {
  const { introduccion, secciones } = politicasPrivacidad

  return (
    <main className={`${contenedorAncho} pb-10`}>
      <h1 className={tituloPagina}>Políticas de privacidad</h1>
      <p className="mt-0 mb-8 text-center text-[18px] text-[#2a2a2a]">{introduccion}</p>

      <IndiceTerminos
        secciones={secciones}
        prefijo={PREFIJO}
        etiqueta="Índice de las políticas de privacidad"
      />

      <div className="grid gap-4">
        {secciones.map((seccion, indice) => (
          <SeccionTermino
            key={seccion.id}
            id={seccion.id}
            numero={indice + 1}
            titulo={seccion.titulo}
            parrafos={seccion.parrafos}
            prefijo={PREFIJO}
          />
        ))}
      </div>
    </main>
  )
}
