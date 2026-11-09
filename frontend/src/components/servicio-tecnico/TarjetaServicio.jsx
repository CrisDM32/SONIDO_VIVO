import { tarjetaClara } from '../../styles/clases.js'

export default function TarjetaServicio({ titulo, descripcion, icono }) {
  return (
    <article className={`flex items-start gap-4 ${tarjetaClara} p-6 text-ink mobile:px-4 mobile:py-5`}>
      <span
        className="grid size-14 flex-none place-items-center rounded-sv bg-page text-[30px]"
        aria-hidden="true"
      >
        {icono}
      </span>
      <div>
        <h3 className="m-0 mb-1 text-[20px]">{titulo}</h3>
        <p className="m-0 leading-[1.6] text-[#2a2a2a]">{descripcion}</p>
      </div>
    </article>
  )
}
