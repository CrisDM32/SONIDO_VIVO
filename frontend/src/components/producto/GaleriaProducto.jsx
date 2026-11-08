import { useState } from 'react'

export default function GaleriaProducto({ imagenes = [], nombre, icono }) {
  const [imagenActiva, setImagenActiva] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-sv bg-paper">
        {imagenes.length > 0 ? (
          <img className="h-full w-full object-contain" src={imagenes[imagenActiva]} alt={`${nombre} - imagen ${imagenActiva + 1}`} />
        ) : (
          <span aria-hidden="true">{icono}</span>
        )}
      </div>

      {imagenes.length > 1 && (
        <div className="flex flex-wrap gap-2.5">
          {imagenes.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`size-[72px] cursor-pointer rounded-sv border-2 bg-paper p-1 transition-[border-color,transform,scale] duration-200 ease-[ease] hover:scale-105 ${i === imagenActiva ? 'border-header' : 'border-transparent'}`}
              aria-label={`Ver imagen ${i + 1}`}
              aria-pressed={i === imagenActiva}
              onClick={() => setImagenActiva(i)}
            >
              <img className="h-full w-full object-contain" src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
