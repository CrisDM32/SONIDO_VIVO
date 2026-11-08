import { useState } from 'react'
import FormularioContacto from '../components/contacto/FormularioContacto.jsx'
import { validarContacto } from '../utils/validacionContacto.js'
import { contenedorCheckout, layoutCheckoutSimple, tituloPagina } from '../styles/clases.js'

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
    <main className={contenedorCheckout}>
      <h1 className={tituloPagina}>Contacto</h1>

      <div className={layoutCheckoutSimple}>
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
