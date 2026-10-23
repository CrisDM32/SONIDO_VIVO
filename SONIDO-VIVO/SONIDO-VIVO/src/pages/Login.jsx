import { useState } from 'react'
import FormularioLogin from '../components/login/FormularioLogin.jsx'
import { validarLogin } from '../utils/validacionLogin.js'

const formInicial = {
  email: '',
  password: '',
}

export default function Login() {
  const [form, setForm] = useState(formInicial)
  const [errores, setErrores] = useState({})

  function handleChange(evento) {
    const { name, value } = evento.target
    setForm((anterior) => ({ ...anterior, [name]: value }))
  }

  function handleSubmit(evento) {
    evento.preventDefault()

    const nuevosErrores = validarLogin(form)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) return

    console.log('Inicio de sesión:', form.email)
  }

  return <FormularioLogin form={form} errores={errores} onChange={handleChange} onSubmit={handleSubmit} />
}
