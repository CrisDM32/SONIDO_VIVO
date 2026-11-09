import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormularioRegistro from '../components/registro/FormularioRegistro.jsx'
import { registrarUsuario } from '../service/sesionService.js'
import { validarRegistro } from '../utils/validacionRegistro.js'

const formInicial = {
  nombre: '',
  email: '',
  rut: '',
  telefono: '',
  password: '',
  password2: '',
  terminos: false,
}

// El backend nombra "correo" al campo que el formulario llama "email".
const campoDelFormulario = { correo: 'email' }

export default function Registro() {
  const [form, setForm] = useState(formInicial)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  function handleChange(evento) {
    const { name, value, type, checked } = evento.target
    setForm((anterior) => ({
      ...anterior,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(evento) {
    evento.preventDefault()
    if (enviando) return

    const nuevosErrores = validarRegistro(form)
    setErrores(nuevosErrores)
    setErrorGeneral('')

    if (Object.keys(nuevosErrores).length > 0) return

    setEnviando(true)
    try {
      await registrarUsuario({
        nombre: form.nombre.trim(),
        correo: form.email.trim(),
        rut: form.rut.trim(),
        telefono: form.telefono.trim(),
        clave: form.password,
      })
      navigate('/iniciar-sesion', { state: { cuentaCreada: true } })
    } catch (error) {
      const campo = campoDelFormulario[error.campo] ?? error.campo
      if (campo && campo in formInicial) {
        setErrores({ [campo]: error.message })
      } else {
        setErrorGeneral(error.message)
      }
      setEnviando(false)
    }
  }

  return (
    <FormularioRegistro
      form={form}
      errores={errores}
      errorGeneral={errorGeneral}
      enviando={enviando}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}
