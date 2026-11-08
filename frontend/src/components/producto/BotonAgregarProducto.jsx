export default function BotonAgregarProducto({ disponible, agregado, onAgregar }) {
  return (
    <button
      type="button"
      className="carrito-button"
      disabled={!disponible}
      onClick={onAgregar}
    >
      {!disponible ? 'Agotado' : agregado ? '¡Agregado! ✓' : 'Añadir al carrito'}
    </button>
  )
}
