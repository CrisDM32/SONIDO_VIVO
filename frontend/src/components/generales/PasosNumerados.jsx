import { tarjetaClara } from '../../styles/clases.js'

export default function PasosNumerados({ titulo, pasos }) {
  const idTitulo = `pasos-${titulo}`

  return (
    <section className="mt-8" aria-labelledby={idTitulo}>
      <h2 id={idTitulo} className="mt-0 mb-3 text-[28px] text-ink mobile:text-[24px]">
        {titulo}
      </h2>
      <ol className="m-0 grid list-none gap-3 p-0">
        {pasos.map((paso, indice) => (
          <li key={paso.titulo} className={`flex items-start gap-4 ${tarjetaClara} px-6 py-5 text-ink mobile:gap-3 mobile:px-4`}>
            <span
              className="grid size-9 flex-none place-items-center rounded-full bg-button text-[18px] font-bold text-paper"
              aria-hidden="true"
            >
              {indice + 1}
            </span>
            <div>
              <h3 className="m-0 mb-1 text-[18px]">{paso.titulo}</h3>
              <p className="m-0 leading-[1.6] text-[#2a2a2a]">{paso.detalle}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
