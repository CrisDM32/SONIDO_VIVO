import { numerosDePagina } from '../../utils/paginacion.js'

const boton =
  'min-h-10 min-w-10 cursor-pointer rounded-sv border border-solid border-button px-3 py-1.5 font-semibold [font-family:inherit] disabled:cursor-not-allowed disabled:opacity-45'
const botonNormal = `${boton} bg-transparent text-button hover:bg-button hover:text-paper disabled:hover:bg-transparent disabled:hover:text-button`
const botonActual = `${boton} bg-header text-paper`

/** Navegación del catálogo: Anterior, números de página y Siguiente. No se muestra si hay una sola página. */
export default function NavegacionPaginas({ pagina, totalPaginas, onCambiar, etiqueta = 'Paginación del catálogo', className = 'mb-[50px]' }) {
  if (totalPaginas <= 1) return null

  return (
    <nav aria-label={etiqueta} className={`${className} flex flex-wrap items-center justify-center gap-2`}>
      <button type="button" className={botonNormal} disabled={pagina === 1} onClick={() => onCambiar(pagina - 1)}>
        Anterior
      </button>

      {numerosDePagina(pagina, totalPaginas).map((numero, i) =>
        numero === '…' ? (
          <span key={`salto-${i}`} aria-hidden="true" className="px-1 text-ink">…</span>
        ) : (
          <button
            key={numero}
            type="button"
            className={numero === pagina ? botonActual : botonNormal}
            aria-label={`Página ${numero}`}
            aria-current={numero === pagina ? 'page' : undefined}
            onClick={() => onCambiar(numero)}
          >
            {numero}
          </button>
        ),
      )}

      <button type="button" className={botonNormal} disabled={pagina === totalPaginas} onClick={() => onCambiar(pagina + 1)}>
        Siguiente
      </button>
    </nav>
  )
}
