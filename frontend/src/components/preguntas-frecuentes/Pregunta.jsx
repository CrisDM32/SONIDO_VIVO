import { tarjetaClara } from '../../styles/clases.js'

export default function Pregunta({ pregunta, respuesta }) {
  return (
    <details className={`group ${tarjetaClara} text-ink`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-[18px] font-semibold [&::-webkit-details-marker]:hidden mobile:px-4 mobile:text-[16px]">
        {pregunta}
        <span
          className="flex-none text-[26px] leading-none transition-transform duration-200 group-open:rotate-45"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <p className="m-0 px-6 pb-5 leading-[1.6] text-[#2a2a2a] mobile:px-4">{respuesta}</p>
    </details>
  )
}
