import { useState } from 'react'

export default function FotoProducto({ src, alt, icono, className }) {
  const [fallida, setFallida] = useState(null)

  if (!src || src === fallida) {
    return <span className={`inline-grid place-items-center ${className}`} role="img" aria-label={alt}>{icono || '♪'}</span>
  }

  return <img src={src} alt={alt} className={className} loading="lazy" referrerPolicy="no-referrer" onError={() => setFallida(src)} />
}
