import { useState } from 'react'

export default function GaleriaProducto({ imagenes = [], nombre, icono }) {
  const [imagenActiva, setImagenActiva] = useState(0)

  return (
    <div className="producto-galeria">
      <div className="producto-imagen-principal">
        {imagenes.length > 0 ? (
          <img src={imagenes[imagenActiva]} alt={`${nombre} - imagen ${imagenActiva + 1}`} />
        ) : (
          <span className="producto-icono" aria-hidden="true">{icono}</span>
        )}
      </div>

      {imagenes.length > 1 && (
        <div className="producto-miniaturas">
          {imagenes.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`producto-miniatura ${i === imagenActiva ? 'activa' : ''}`}
              aria-label={`Ver imagen ${i + 1}`}
              aria-pressed={i === imagenActiva}
              onClick={() => setImagenActiva(i)}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
