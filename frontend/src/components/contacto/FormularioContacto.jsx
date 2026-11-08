import CampoFormulario from '../pago/CampoFormulario.jsx'
import {
  botonPrincipal,
  formularioCheckout,
  mensajeExito,
  tarjetaCheckoutClara,
  tituloTarjeta,
} from '../../styles/clases.js'

export default function FormularioContacto({ formulario, errores, exito, onCambio, onSubmit }) {
  return (
    <section className={tarjetaCheckoutClara}>
      <h2 className={tituloTarjeta}>Datos de contacto</h2>

      <form className={formularioCheckout} onSubmit={onSubmit} noValidate>
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

        <button type="submit" className={botonPrincipal}>
          Enviar
        </button>

        {exito && (
          <p className={mensajeExito}>
            ¡Mensaje enviado! Nos pondremos en contacto contigo pronto.
          </p>
        )}
      </form>
    </section>
  )
}
