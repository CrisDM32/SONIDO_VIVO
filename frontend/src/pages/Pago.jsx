import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { calcularTotalCarrito, obtenerCarrito } from '../utils/carrito.js'
import { validarEnvio } from '../utils/validacionEnvio.js'
import { regionesChile } from '../data/regionesChile.js'
import FormularioEnvio from '../components/pago/FormularioEnvio.jsx'
import ResumenPedido from '../components/pago/ResumenPedido.jsx'
import { contenedorCheckout, layoutCheckoutDos, tituloPagina } from '../styles/clases.js'

export default function Pago() {
  const navigate = useNavigate()
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

    if (carrito.length === 0) return

    const nuevosErrores = validarEnvio(formulario)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) return

    navigate('/pago-tarjeta')
  }

  return (
    <main className={contenedorCheckout}>
      <h1 className={tituloPagina}>Datos de envío</h1>

      <div className={layoutCheckoutDos}>
        <FormularioEnvio
          formulario={formulario}
          errores={errores}
          carritoVacio={carrito.length === 0}
          onCambio={handleCambio}
          onSubmit={handleSubmit}
        />

        <ResumenPedido carrito={carrito} total={total} />
      </div>
    </main>
  )
}
