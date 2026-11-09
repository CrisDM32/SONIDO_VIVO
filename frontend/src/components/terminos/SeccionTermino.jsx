import { tarjetaClara } from '../../styles/clases.js'

export default function SeccionTermino({ id, numero, titulo, parrafos, prefijo = 'termino' }) {
  return (
    <section
      id={`${prefijo}-${id}`}
      className={`${tarjetaClara} px-7 py-6 text-ink mobile:px-4 mobile:py-5`}
      aria-labelledby={`${prefijo}-titulo-${id}`}
    >
      <h2 id={`${prefijo}-titulo-${id}`} className="mt-0 mb-3 text-[22px]">
        {numero}. {titulo}
      </h2>
      {parrafos.map((parrafo) => (
        <p key={parrafo} className="mt-0 mb-3 leading-[1.7] text-[#2a2a2a] last:mb-0">
          {parrafo}
        </p>
      ))}
    </section>
  )
}
