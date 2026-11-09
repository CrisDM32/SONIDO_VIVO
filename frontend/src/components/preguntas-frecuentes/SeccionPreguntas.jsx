import Pregunta from './Pregunta.jsx'

export default function SeccionPreguntas({ titulo, preguntas }) {
  return (
    <section className="mb-8" aria-labelledby={`faq-${titulo}`}>
      <h2 id={`faq-${titulo}`} className="mt-0 mb-3 text-[28px] text-ink mobile:text-[24px]">
        {titulo}
      </h2>
      <div className="grid gap-3">
        {preguntas.map((item) => (
          <Pregunta key={item.pregunta} pregunta={item.pregunta} respuesta={item.respuesta} />
        ))}
      </div>
    </section>
  )
}
