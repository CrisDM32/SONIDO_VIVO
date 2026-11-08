import { useEffect, useState } from 'react'

const Miniatura = ({ src, alt, className = 'h-12 w-12' }) => {
  const [falla, setFalla] = useState(false)

  useEffect(() => {
    setFalla(false)
  }, [src])

  const clases = `shrink-0 rounded-md bg-stone-200 object-cover ${className}`

  if (!src || falla) {
    return (
      <div
        className={`${clases} grid place-items-center text-[10px] uppercase tracking-wide text-stone-500`}
        aria-hidden
      >
        img
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      title={src}
      className={clases}
      onError={() => setFalla(true)}
    />
  )
}

export default Miniatura
