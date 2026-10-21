function CampoFormulario({ id, label, type = 'text', value, onChange, placeholder, error, name }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'invalido' : ''}
      />
      {error && <small className="error">{error}</small>}
    </div>
  )
}

export default function FormularioRegistro({ form, errores, exito, onChange, onSubmit }) {
  return (
    <main className="contenedor-formulario">
      <h1>Crear cuenta de cliente</h1>
      <p className="subtitulo">
        Completa tus datos para crear tu perfil y poder hacer pedidos en línea.
      </p>

      <form onSubmit={onSubmit} noValidate>
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

        <div className="campo campo-checkbox">
          <label>
            <input
              type="checkbox"
              name="terminos"
              checked={form.terminos}
              onChange={onChange}
            />
            Acepto los términos y condiciones *
          </label>
          {errores.terminos && <small className="error">{errores.terminos}</small>}
        </div>

        <button type="submit" className="boton-principal boton-ancho-auto">
          Crear cuenta
        </button>

        {exito && (
          <p className="mensaje-exito">
            ¡Cuenta creada correctamente! Ya puedes iniciar sesión.
          </p>
        )}
      </form>
    </main>
  )
}
