import CampoFormulario from '../pago/CampoFormulario.jsx'
import { regionesChile } from '../../data/regionesChile.js'
import {
  botonPrincipal,
  filaCampos,
  formularioCheckout,
  mensajeExito,
  tarjetaClara,
} from '../../styles/clases.js'

export default function FormularioPerfil({ formulario, errores, guardado, onCambio, onSubmit }) {
  const regiones = Object.keys(regionesChile)
  const comunasDisponibles = regionesChile[formulario.region] || []

  return (
    <section className={`${tarjetaClara} p-7 text-ink mobile:px-4 mobile:py-5`} aria-labelledby="perfil-contacto">
      <h2 id="perfil-contacto" className="mt-0 mb-1 text-[24px]">Contacto y dirección de envío</h2>
      <p className="mt-0 mb-5 text-[#555]">Se usarán para completar tus datos al comprar.</p>

      <form className={formularioCheckout} onSubmit={onSubmit} noValidate>
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

        <button type="submit" className={botonPrincipal}>
          Guardar cambios
        </button>

        {guardado && (
          <p className={mensajeExito} role="status">
            Tus datos se guardaron correctamente.
          </p>
        )}
      </form>
    </section>
  )
}
