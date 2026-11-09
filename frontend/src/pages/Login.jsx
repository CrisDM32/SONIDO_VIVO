import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FormularioLogin from '../components/login/FormularioLogin.jsx'
import { useSesion } from '../hooks/useSesion.js'
import { iniciarSesion } from '../service/sesionService.js'
import { validarLogin } from '../utils/validacionLogin.js'

const formInicial = {
  email: '',
  password: '',
}

export default function Login() {
  const [form, setForm] = useState(formInicial)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const { iniciar } = useSesion()
  const navigate = useNavigate()
  const location = useLocation()

  function handleChange(evento) {
    const { name, value } = evento.target
    setForm((anterior) => ({ ...anterior, [name]: value }))
  }

  async function handleSubmit(evento) {
    evento.preventDefault()
    if (enviando) return

    const nuevosErrores = validarLogin(form)
    setErrores(nuevosErrores)
    setErrorGeneral('')

    if (Object.keys(nuevosErrores).length > 0) return

    setEnviando(true)
    try {
      const { token } = await iniciarSesion({ correo: form.email.trim(), clave: form.password })
      iniciar(token)
      navigate('/')
    } catch (error) {
      setErrorGeneral(error.message)
      setEnviando(false)
    }
  }

  return (
    <FormularioLogin
      form={form}
      errores={errores}
      errorGeneral={errorGeneral}
      aviso={location.state?.cuentaCreada ? 'Cuenta creada correctamente. Ya puedes iniciar sesión.' : ''}
      enviando={enviando}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}
