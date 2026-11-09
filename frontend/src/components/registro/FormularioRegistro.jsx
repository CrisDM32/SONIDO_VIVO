import {
  botonPrincipal,
  botonPrincipalDeshabilitado,
  campo,
  campoError,
  campoEtiqueta,
  campoInput,
  contenedorFormulario,
  formularioTarjeta,
  subtituloFormulario,
  tituloFormulario,
} from '../../styles/clases.js'

function CampoFormulario({ id, label, type = 'text', value, onChange, placeholder, error, name }) {
  return (
    <div className={campo}>
      <label htmlFor={id} className={campoEtiqueta}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={campoInput(Boolean(error))}
      />
      {error && <small className={campoError}>{error}</small>}
    </div>
  )
}

export default function FormularioRegistro({ form, errores, errorGeneral, enviando, onChange, onSubmit }) {
  return (
    <main className={contenedorFormulario}>
      <h1 className={tituloFormulario}>Crear cuenta de cliente</h1>
      <p className={subtituloFormulario}>
        Completa tus datos para crear tu perfil y poder hacer pedidos en línea.
      </p>

      <form className={formularioTarjeta} onSubmit={onSubmit} noValidate>
        <CampoFormulario
          id="nombre"
          name="nombre"
          label="Nombre completo *"
          value={form.nombre}
          onChange={onChange}
          placeholder="Ej: María González"
          error={errores.nombre}
        />

        <CampoFormulario
          id="email"
          name="email"
          label="Correo electrónico *"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="tucorreo@ejemplo.com"
          error={errores.email}
        />

        <CampoFormulario
          id="rut"
          name="rut"
          label="RUT *"
          value={form.rut}
          onChange={onChange}
          placeholder="12.345.678-5"
          error={errores.rut}
        />

        <CampoFormulario
          id="telefono"
          name="telefono"
          label="Teléfono"
          type="tel"
          value={form.telefono}
          onChange={onChange}
          placeholder="+56 9 1234 5678"
          error={errores.telefono}
        />

        <CampoFormulario
          id="password"
          name="password"
          label="Contraseña *"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="Mínimo 8 caracteres"
          error={errores.password}
        />

        <CampoFormulario
          id="password2"
          name="password2"
          label="Repetir contraseña *"
          type="password"
          value={form.password2}
          onChange={onChange}
          placeholder="Vuelve a escribir la contraseña"
          error={errores.password2}
        />

        <div className={campo}>
          <label className="flex items-center gap-2.5 font-semibold text-ink mobile:items-start">
            <input
              className={`${campoInput(false)} h-[18px]`}
              type="checkbox"
              name="terminos"
              checked={form.terminos}
              onChange={onChange}
            />
            Acepto los términos y condiciones *
          </label>
          {errores.terminos && <small className={campoError}>{errores.terminos}</small>}
        </div>

        {errorGeneral && (
          <p role="alert" className={`m-0 ${campoError}`}>
            {errorGeneral}
          </p>
        )}

        <button type="submit" className={enviando ? botonPrincipalDeshabilitado : botonPrincipal} disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </main>
  )
}
