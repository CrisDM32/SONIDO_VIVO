import CampoFormulario from '../pago/CampoFormulario.jsx'

export default function FormularioLogin({ form, errores, onChange, onSubmit }) {
  return (
    <main className="contenedor-formulario">
      <h1>Iniciar sesión</h1>
      <p className="subtitulo">Ingresa tu correo y contraseña para acceder a tu cuenta.</p>

      <form onSubmit={onSubmit} noValidate>
        <CampoFormulario
          id="email"
          name="email"
          label="Correo electrónico"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="tucorreo@ejemplo.com"
          error={errores.email}
        />

        <CampoFormulario
          id="password"
          name="password"
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="Tu contraseña"
          error={errores.password}
        />

        <a href="recuperar-contrasena.html" className="enlace-olvido">
          ¿Olvidaste tu contraseña?
        </a>

        <button type="submit" className="boton-principal boton-ancho-auto">
          Iniciar sesión
        </button>

        <p className="enlace-registro">
          ¿No tienes cuenta? <a href="registro.html">Regístrate</a>
        </p>
      </form>
    </main>
  )
}
