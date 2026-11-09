import { tarjetaClara } from '../../styles/clases.js'

export default function IndiceTerminos({
  secciones,
  prefijo = 'termino',
  etiqueta = 'Índice de los términos y condiciones',
}) {
  return (
    <nav className={`${tarjetaClara} mb-8 p-7 text-ink mobile:px-4 mobile:py-5`} aria-label={etiqueta}>
      <h2 className="mt-0 mb-3 text-[22px]">Contenido</h2>
      <ol className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-2 p-0 mobile:grid-cols-1">
        {secciones.map((seccion, indice) => (
          <li key={seccion.id}>
            <a href={`#${prefijo}-${seccion.id}`} className="text-ink underline-offset-[3px] hover:underline">
              {indice + 1}. {seccion.titulo}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
