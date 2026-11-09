import { Link } from 'react-router-dom'
import CampoFormulario from '../pago/CampoFormulario.jsx'
import {
  botonPrincipal,
  botonPrincipalDeshabilitado,
  campoError,
  contenedorFormulario,
  formularioTarjeta,
  mensajeExito,
  subtituloFormulario,
  tituloFormulario,
} from '../../styles/clases.js'

export default function FormularioLogin({ form, errores, errorGeneral, aviso, enviando, onChange, onSubmit }) {
  return (
    <main className={contenedorFormulario}>
      <h1 className={tituloFormulario}>Iniciar sesión</h1>
      <p className={subtituloFormulario}>Ingresa tu correo y contraseña para acceder a tu cuenta.</p>

      <form className={formularioTarjeta} onSubmit={onSubmit} noValidate>
        {aviso && (
          <p role="status" className={mensajeExito}>
            {aviso}
          </p>
        )}

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

        <a href="recuperar-contrasena.html" className="self-start text-[14px] font-semibold text-button underline">
          ¿Olvidaste tu contraseña?
        </a>

        {errorGeneral && (
          <p role="alert" className={`m-0 ${campoError}`}>
            {errorGeneral}
          </p>
        )}

        <button type="submit" className={enviando ? botonPrincipalDeshabilitado : botonPrincipal} disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Iniciar sesión'}
        </button>

        <p className="m-0 text-center text-[14px]">
          ¿No tienes cuenta? <Link to="/registro" className="font-semibold underline">Regístrate</Link>
        </p>
      </form>
    </main>
  )
}
