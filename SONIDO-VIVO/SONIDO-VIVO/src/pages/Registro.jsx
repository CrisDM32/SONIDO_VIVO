import { useState } from 'react'
import FormularioRegistro from '../components/registro/FormularioRegistro.jsx'
import { validarRegistro } from '../utils/validacionRegistro.js'

const formInicial = {
  nombre: '',
  email: '',
  telefono: '',
  password: '',
  password2: '',
  terminos: false,
}

export default function Registro() {
  const [form, setForm] = useState(formInicial)
  const [errores, setErrores] = useState({})
  const [exito, setExito] = useState(false)

  function handleChange(evento) {
    const { name, value, type, checked } = evento.target
    setForm((anterior) => ({
      ...anterior,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSubmit(evento) {
    evento.preventDefault()

    const nuevosErrores = validarRegistro(form)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      setExito(false)
      return
    }

    console.log('Nuevo usuario:', form)
    setExito(true)
    setForm(formInicial)
  }

  return (
    <FormularioRegistro
      form={form}
      errores={errores}
      exito={exito}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}

