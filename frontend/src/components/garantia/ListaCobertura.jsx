import { tarjetaClara } from '../../styles/clases.js'

export default function ListaCobertura({ titulo, items, incluye }) {
  return (
    <section className={`${tarjetaClara} p-7 text-ink mobile:px-4 mobile:py-5`}>
      <h2 className="mt-0 mb-3 text-[24px]">{titulo}</h2>
      <ul className="m-0 grid list-none gap-3 p-0">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 leading-[1.5]">
            <span
              className={`mt-0.5 grid size-6 flex-none place-items-center rounded-full text-[14px] font-bold text-white ${
                incluye ? 'bg-[#1f6d3a]' : 'bg-[#b42318]'
              }`}
              aria-hidden="true"
            >
              {incluye ? '✓' : '✕'}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
