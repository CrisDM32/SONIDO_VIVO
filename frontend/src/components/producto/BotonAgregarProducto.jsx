import { botonCarrito } from '../../styles/clases.js'

export default function BotonAgregarProducto({ disponible, agregado, onAgregar }) {
  return (
    <button
      type="button"
      className={`${botonCarrito} mt-2 disabled:cursor-not-allowed disabled:opacity-50`}
      disabled={!disponible}
      onClick={onAgregar}
    >
      {!disponible ? 'Agotado' : agregado ? '¡Agregado! ✓' : 'Añadir al carrito'}
    </button>
  )
}
