import { useState } from 'react'
import CampoFormulario from '../pago/CampoFormulario.jsx'
import { erroresDeServidor } from '../../utils/erroresServidor.js'
import { validarPersonal } from '../../utils/validacionPersonal.js'
import {
  botonPrincipal,
  botonPrincipalDeshabilitado,
  botonSecundario,
  campoError,
  filaCampos,
  formularioTarjeta,
  tituloTarjeta,
} from '../../styles/clases.js'

const CAMPOS = ['nombre', 'correo', 'rut', 'telefono', 'clave', 'perfil']
const formInicial = { nombre: '', correo: '', rut: '', telefono: '', clave: '', perfil: 'vendedor' }

/** Alta de personal (vendedor o administrador). `onGuardar` hace la llamada y lanza el error si falla. */
export default function FormularioPersonal({ onGuardar, onCancelar }) {
  const [form, setForm] = useState(formInicial)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function handleChange(evento) {
    const { name, value } = evento.target
    setForm((anterior) => ({ ...anterior, [name]: value }))
  }

  async function handleSubmit(evento) {
    evento.preventDefault()
    if (enviando) return

    const nuevosErrores = validarPersonal(form)
    setErrores(nuevosErrores)
    setErrorGeneral('')
    if (Object.keys(nuevosErrores).length > 0) return

    setEnviando(true)
    try {
      await onGuardar({
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        rut: form.rut.trim(),
        telefono: form.telefono.trim(),
        clave: form.clave,
        perfil: form.perfil,
      })
    } catch (error) {
      const { campos, general } = erroresDeServidor(error, CAMPOS)
      setErrores(campos)
      setErrorGeneral(general)
      setEnviando(false)
    }
  }

  return (
    <form className={formularioTarjeta} onSubmit={handleSubmit} noValidate aria-label="Nuevo miembro del personal">
      <h2 className={tituloTarjeta}>Nuevo miembro del personal</h2>

      <CampoFormulario id="personal-nombre" name="nombre" label="Nombre completo *" value={form.nombre} onChange={handleChange} error={errores.nombre} />

      <div className={filaCampos}>
        <CampoFormulario id="personal-correo" name="correo" label="Correo electrónico *" type="email" value={form.correo} onChange={handleChange} error={errores.correo} />
        <CampoFormulario id="personal-rut" name="rut" label="RUT *" value={form.rut} onChange={handleChange} placeholder="12.345.678-5" error={errores.rut} />
      </div>

      <div className={filaCampos}>
        <CampoFormulario id="personal-telefono" name="telefono" label="Teléfono" type="tel" value={form.telefono} onChange={handleChange} error={errores.telefono} />
        <CampoFormulario id="personal-perfil" name="perfil" label="Perfil *" value={form.perfil} onChange={handleChange} error={errores.perfil}>
          <option value="vendedor">Vendedor</option>
          <option value="administrador">Administrador</option>
        </CampoFormulario>
      </div>

      <CampoFormulario id="personal-clave" name="clave" label="Contraseña *" type="password" value={form.clave} onChange={handleChange} placeholder="Mínimo 8 caracteres" error={errores.clave} />

      {errorGeneral && (
        <p role="alert" className={`m-0 ${campoError}`}>
          {errorGeneral}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={enviando} className={enviando ? botonPrincipalDeshabilitado : botonPrincipal}>
          {enviando ? 'Creando…' : 'Crear usuario'}
        </button>
        <button type="button" onClick={onCancelar} className={botonSecundario}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
