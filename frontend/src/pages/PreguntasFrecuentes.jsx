import { preguntasFrecuentes } from '../data/preguntasFrecuentes.js'
import SeccionPreguntas from '../components/preguntas-frecuentes/SeccionPreguntas.jsx'
import BloqueContacto from '../components/generales/BloqueContacto.jsx'
import { contenedorAncho, tituloPagina } from '../styles/clases.js'

export default function PreguntasFrecuentes() {
  return (
    <main className={`${contenedorAncho} pb-10`}>
      <h1 className={tituloPagina}>Preguntas frecuentes</h1>
      <p className="mt-0 mb-8 text-center text-[18px] text-[#2a2a2a]">
        Resolvemos las dudas más comunes sobre tu compra en Sonido Vivo.
      </p>

      {preguntasFrecuentes.map((seccion) => (
        <SeccionPreguntas key={seccion.titulo} titulo={seccion.titulo} preguntas={seccion.preguntas} />
      ))}

      <BloqueContacto titulo="¿No encontraste tu respuesta?" />
    </main>
  )
}
