import { tarjetaClara } from '../../styles/clases.js'

export default function InformacionNecesaria({ items }) {
  return (
    <section className={`mt-8 ${tarjetaClara} p-7 text-ink mobile:px-4 mobile:py-5`}>
      <h2 className="mt-0 mb-3 text-[24px]">¿Qué información necesitamos?</h2>
      <ul className="m-0 grid list-none gap-3 p-0">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 leading-[1.5]">
            <span
              className="mt-0.5 grid size-6 flex-none place-items-center rounded-full bg-button text-[14px] font-bold text-paper"
              aria-hidden="true"
            >
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
