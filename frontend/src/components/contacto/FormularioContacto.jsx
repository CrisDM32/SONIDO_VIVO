import CampoFormulario from '../pago/CampoFormulario.jsx'

export default function FormularioContacto({ formulario, errores, exito, onCambio, onSubmit }) {
  return (
    <section className="checkout-card">
      <h2>Datos de contacto</h2>

      <form className="checkout-form" onSubmit={onSubmit} noValidate>
        <CampoFormulario
          id="nombre"
          name="nombre"
          label="Nombre completo"
          value={formulario.nombre}
          onChange={onCambio}
          placeholder="Ej: María José Pérez"
          error={errores.nombre}
        />

        <CampoFormulario
          id="telefono"
          name="telefono"
          label="Teléfono"
          type="tel"
          value={formulario.telefono}
          onChange={onCambio}
          placeholder="+56 9 1234 5678"
          error={errores.telefono}
        />

        <CampoFormulario
          id="correo"
          name="correo"
          label="Correo electrónico"
          type="email"
          value={formulario.correo}
          onChange={onCambio}
          placeholder="nombre@correo.com"
          error={errores.correo}
        />

        <CampoFormulario
          id="motivo"
          name="motivo"
          label="Motivo de contacto"
          rows={5}
          value={formulario.motivo}
          onChange={onCambio}
          placeholder="Cuéntanos el motivo de tu consulta"
          error={errores.motivo}
        />

        <button type="submit" className="boton-principal boton-ancho-auto">
          Enviar
        </button>

        {exito && (
          <p className="mensaje-exito">
            ¡Mensaje enviado! Nos pondremos en contacto contigo pronto.
          </p>
        )}
      </form>
    </section>
  )
}
