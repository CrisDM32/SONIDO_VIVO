import { useMemo, useState } from 'react'
import { calcularTotalCarrito, obtenerCarrito } from '../utils/carrito.js'
import FormularioContacto from '../components/pago/FormularioContacto.jsx'
import ResumenPedido from '../components/pago/ResumenPedido.jsx'

const regionesChile = {
  'Región de Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte'],
  'Región de Antofagasta': ['Antofagasta', 'Calama', 'Taltal'],
  'Región de Atacama': ['Copiapó', 'Vallenar', 'Caldera'],
  'Región de Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle'],
  'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'San Antonio'],
  'Región Metropolitana': ['Santiago', 'Puente Alto', 'Maipú'],
  'Región del Libertador General Bernardo O\'Higgins': ['Rancagua', 'San Fernando', 'Machalí'],
  'Región del Maule': ['Talca', 'Curicó', 'Linares'],
  'Región de Ñuble': ['Chillán', 'Bulnes', 'San Carlos'],
  'Región del Biobío': ['Concepción', 'Los Ángeles', 'Talcahuano'],
  'Región de La Araucanía': ['Temuco', 'Villarrica', 'Padre Las Casas'],
  'Región de Los Ríos': ['Valdivia', 'La Unión', 'Río Bueno'],
  'Región de Los Lagos': ['Puerto Montt', 'Osorno', 'Castro'],
  'Región de Aysén del General Carlos Ibáñez del Campo': ['Coyhaique', 'Puerto Aysén', 'Villa O\'Higgins'],
  'Región de Magallanes y de la Antártica Chilena': ['Punta Arenas', 'Puerto Natales', 'Porvenir'],
}

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
    window.location.assign('pago-tarjeta.html')
  }

  return (
    <main className="contenedor-ancho checkout-page">
      <h1 className="section-title-productos">Datos de contacto y envío</h1>

      <div className="checkout-layout">
        <FormularioContacto
          formulario={formulario}
          onCambio={handleCambio}
          onSubmit={handleSubmit}
        />

        <ResumenPedido carrito={carrito} total={total} />
      </div>
    </main>
  )
}
