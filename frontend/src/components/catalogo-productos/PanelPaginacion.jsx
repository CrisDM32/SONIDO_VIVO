import { campoInput } from '../../styles/clases.js'
import { OPCIONES_TAMANO } from '../../utils/paginacion.js'

/** Panel superior del catálogo: cuántos productos mostrar por página y qué rango se ve. */
export default function PanelPaginacion({ tamano, onTamanoChange, desde, hasta, total }) {
  return (
    <section
      aria-label="Cantidad de productos mostrados"
      className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgb(18_18_18/10%)] bg-paper px-5 py-3 text-ink shadow-[0_4px_16px_rgb(18_18_18/8%)] mobile:px-4"
    >
      <p className="m-0" role="status">
        Mostrando <strong>{desde}–{hasta}</strong> de <strong>{total}</strong> productos
      </p>

      <label className="flex items-center gap-2.5 font-semibold" htmlFor="productos-por-pagina">
        Productos por página
        <select
          id="productos-por-pagina"
          value={tamano}
          onChange={(evento) => onTamanoChange(Number(evento.target.value))}
          className={`${campoInput(false)} !min-h-10 !w-auto`}
        >
          {OPCIONES_TAMANO.map((opcion) => (
            <option key={opcion} value={opcion}>{opcion}</option>
          ))}
        </select>
      </label>
    </section>
  )
}
