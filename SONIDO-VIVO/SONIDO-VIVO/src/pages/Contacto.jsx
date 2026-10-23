import { useState } from 'react'
import FormularioContacto from '../components/contacto/FormularioContacto.jsx'
import { validarContacto } from '../utils/validacionContacto.js'

const formInicial = {
  nombre: '',
  telefono: '',
  correo: '',
  motivo: '',
}

export default function Contacto() {
  const [formulario, setFormulario] = useState(formInicial)
  const [errores, setErrores] = useState({})
  const [exito, setExito] = useState(false)

  function handleCambio(evento) {
    const { name, value } = evento.target
    setFormulario((anterior) => ({ ...anterior, [name]: value }))
  }

  function handleSubmit(evento) {
    evento.preventDefault()

    const nuevosErrores = validarContacto(formulario)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      setExito(false)
      return
    }

    console.log('Contacto enviado:', formulario)
    setExito(true)
    setFormulario(formInicial)
  }

  return (
    <main className="contenedor-ancho checkout-page">
      <h1 className="section-title-productos">Contacto</h1>

      <div className="checkout-layout checkout-layout-simple">
        <FormularioContacto
          formulario={formulario}
          errores={errores}
          exito={exito}
          onCambio={handleCambio}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  )
}
