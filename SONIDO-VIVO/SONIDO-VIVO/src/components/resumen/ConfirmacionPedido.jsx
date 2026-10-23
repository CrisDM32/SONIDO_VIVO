export default function ConfirmacionPedido() {
  return (
    <header className="resumen-exito">
      <span className="resumen-exito-icono" aria-hidden="true">✓</span>
      <div>
        <p className="resumen-exito-etiqueta">Pedido confirmado</p>
        <h1>¡Gracias por tu compra!</h1>
        <p>Tu pedido fue registrado correctamente.</p>
      </div>
    </header>
  )
}
