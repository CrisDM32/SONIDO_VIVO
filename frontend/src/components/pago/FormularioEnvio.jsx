import { Link } from 'react-router-dom'
import CampoFormulario from './CampoFormulario.jsx'
import { regionesChile } from '../../data/regionesChile.js'
import {
  botonPrincipal,
  filaCampos,
  formularioCheckout,
  resumenVacio,
  tarjetaCheckoutClara,
  tituloTarjeta,
} from '../../styles/clases.js'

export default function FormularioEnvio({ formulario, errores, carritoVacio, onCambio, onSubmit }) {
  const regiones = Object.keys(regionesChile)
  const comunasDisponibles = regionesChile[formulario.region] || []

  return (
    <section className={tarjetaCheckoutClara}>
      <h2 className={tituloTarjeta}>Datos de envío</h2>

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

        <div className={filaCampos}>
          <CampoFormulario
            id="rut"
            name="rut"
            label="RUT"
            value={formulario.rut}
            onChange={onCambio}
            placeholder="12.345.678-5"
            error={errores.rut}
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
        </div>

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
          id="direccion"
          name="direccion"
          label="Dirección"
          value={formulario.direccion}
          onChange={onCambio}
          placeholder="Calle, número, depto."
          error={errores.direccion}
        />

        <div className={filaCampos}>
          <CampoFormulario
            id="region"
            name="region"
            label="Región"
            value={formulario.region}
            onChange={onCambio}
            error={errores.region}
          >
            {regiones.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </CampoFormulario>

          <CampoFormulario
            id="comuna"
            name="comuna"
            label="Comuna"
            value={formulario.comuna}
            onChange={onCambio}
            error={errores.comuna}
          >
            {comunasDisponibles.map((comuna) => (
              <option key={comuna} value={comuna}>
                {comuna}
              </option>
            ))}
          </CampoFormulario>
        </div>

        <button type="submit" className={botonPrincipal} disabled={carritoVacio}>
          Continuar
        </button>

        {carritoVacio && (
          <p className={resumenVacio} role="status">
            Agrega productos al carrito antes de continuar. <Link to="/productos">Ver catálogo</Link>
          </p>
        )}
      </form>
    </section>
  )
}
