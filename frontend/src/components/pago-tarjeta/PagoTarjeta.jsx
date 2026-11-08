import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  calcularTotalCarrito,
  formatearPrecioCLP,
  obtenerCarrito,
  vaciarCarrito,
} from '../../utils/carrito.js'
import { validarPagoTarjeta } from '../../utils/validacionPagoTarjeta.js'
import CampoFormulario from '../pago/CampoFormulario.jsx'
import {
  botonPrincipal,
  contenedorCheckout,
  filaCampos,
  formularioCheckout,
  layoutCheckoutDos,
  lineaTotal,
  montoTotal,
  resumenItemOscuro,
  resumenVacio,
  tarjetaCheckoutClara,
  tarjetaCheckoutOscura,
  tituloPagina,
  tituloTarjeta,
  tituloTarjetaOscura,
} from '../../styles/clases.js'

const PEDIDO_KEY = 'sv_ultimo_pedido'

const formInicial = {
  nombreTitular: '',
  numeroTarjeta: '',
  fechaVencimiento: '',
  ccv: '',
}

function crearPedido(carrito, total) {
  return {
    numero: `SV-${Math.floor(10000 + Math.random() * 90000)}`,
    fecha: new Date().toLocaleString('es-CL'),
    items: carrito,
    total,
  }
}

export default function PagoTarjeta() {
  const navigate = useNavigate()
  const carrito = useMemo(() => obtenerCarrito(), [])
  const total = calcularTotalCarrito(carrito)
  const [form, setForm] = useState(formInicial)
  const [errores, setErrores] = useState({})

  function handleChange(evento) {
    const { name, value } = evento.target
    setForm((anterior) => ({ ...anterior, [name]: value }))
  }

  function handleSubmit(evento) {
    evento.preventDefault()

    if (carrito.length === 0) {
      return
    }

    const nuevosErrores = validarPagoTarjeta(form)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    localStorage.setItem(PEDIDO_KEY, JSON.stringify(crearPedido(carrito, total)))
    vaciarCarrito()
    navigate('/resumen')
  }

  return (
    <main className={contenedorCheckout}>
      <h1 className={tituloPagina}>Pago con tarjeta</h1>

      <div className={layoutCheckoutDos}>
        <section className={tarjetaCheckoutClara}>
          <h2 className={tituloTarjeta}>Datos de pago</h2>
          <p>Ingresa los datos del titular y de la tarjeta.</p>

          <form className={formularioCheckout} onSubmit={handleSubmit} noValidate>
            <CampoFormulario
              id="nombreTitular"
              name="nombreTitular"
              label="Nombre del titular"
              value={form.nombreTitular}
              onChange={handleChange}
              placeholder="Como aparece en la tarjeta"
              error={errores.nombreTitular}
            />

            <CampoFormulario
              id="numeroTarjeta"
              name="numeroTarjeta"
              label="Número de tarjeta"
              value={form.numeroTarjeta}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              error={errores.numeroTarjeta}
            />

            <div className={filaCampos}>
              <CampoFormulario
                id="fechaVencimiento"
                name="fechaVencimiento"
                label="Fecha de vencimiento"
                type="month"
                value={form.fechaVencimiento}
                onChange={handleChange}
                error={errores.fechaVencimiento}
              />

              <CampoFormulario
                id="ccv"
                name="ccv"
                label="CCV"
                type="password"
                value={form.ccv}
                onChange={handleChange}
                placeholder="123"
                error={errores.ccv}
              />
            </div>

            <button
              type="submit"
              className={botonPrincipal}
              disabled={carrito.length === 0}
            >
              Pagar {formatearPrecioCLP(total)}
            </button>

            {carrito.length === 0 && (
              <p className={resumenVacio} role="status">
                Agrega productos al carrito antes de pagar. <Link to="/productos">Ver catálogo</Link>
              </p>
            )}
            <p className={resumenVacio}>
              Pago de demostración: no se enviará ni almacenará información de la tarjeta.
            </p>
          </form>
        </section>

        <aside className={tarjetaCheckoutOscura}>
          <h2 className={tituloTarjetaOscura}>Resumen del pedido</h2>

          {carrito.length === 0 ? (
            <p className={resumenVacio}>Tu carrito está vacío.</p>
          ) : (
            <>
              {carrito.map((item) => (
                <div className={resumenItemOscuro} key={item.id}>
                  <span>{item.icono} {item.nombre} x{item.cantidad}</span>
                  <span>{formatearPrecioCLP(item.precio * item.cantidad)}</span>
                </div>
              ))}

              <div className={lineaTotal}>
                <span>Total a pagar:</span>
                <span className={montoTotal}>{formatearPrecioCLP(total)}</span>
              </div>
            </>
          )}
        </aside>
      </div>
    </main>
  )
}
