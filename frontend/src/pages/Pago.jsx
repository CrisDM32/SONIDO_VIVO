import { useMemo, useState } from 'react'
import { calcularTotalCarrito, obtenerCarrito } from '../utils/carrito.js'
import { validarEnvio } from '../utils/validacionEnvio.js'
import { regionesChile } from '../data/regionesChile.js'
import FormularioEnvio from '../components/pago/FormularioEnvio.jsx'
import ResumenPedido from '../components/pago/ResumenPedido.jsx'

export default function Pago() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
    direccion: '',
    region: 'Región Metropolitana',
    comuna: 'Santiago',
  })
  const [errores, setErrores] = useState({})

  const carrito = useMemo(() => obtenerCarrito(), [])
  const total = calcularTotalCarrito(carrito)

  function handleCambio(evento) {
    const { name, value } = evento.target
    setFormulario((anterior) => {
      const estado = { ...anterior, [name]: value }

      if (name === 'region') {
        estado.comuna = (regionesChile[value] || [])[0] || ''
      }

      return estado
    })
  }

  function handleSubmit(evento) {
    evento.preventDefault()

    const nuevosErrores = validarEnvio(formulario)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) return

    window.location.assign('pago-tarjeta.html')
  }

  return (
    <main className="contenedor-ancho checkout-page">
      <h1 className="section-title-productos">Datos de envío</h1>

      <div className="checkout-layout">
        <FormularioEnvio
          formulario={formulario}
          errores={errores}
          onCambio={handleCambio}
          onSubmit={handleSubmit}
        />

        <ResumenPedido carrito={carrito} total={total} />
      </div>
    </main>
  )
}
