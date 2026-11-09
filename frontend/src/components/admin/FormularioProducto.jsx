import { useState } from 'react'
import CampoFormulario from '../pago/CampoFormulario.jsx'
import { categorias } from '../../data/categorias.js'
import { erroresDeServidor } from '../../utils/erroresServidor.js'
import { validarProducto } from '../../utils/validacionProducto.js'
import {
  botonPrincipal,
  botonPrincipalDeshabilitado,
  botonSecundario,
  campoError,
  filaCampos,
  formularioTarjeta,
  tituloTarjeta,
} from '../../styles/clases.js'

const CAMPOS = ['nombre', 'categoria', 'precio', 'stock', 'icono']

function formularioDesde(producto) {
  return {
    nombre: producto?.nombre ?? '',
    categoria: producto?.categoria ?? categorias[0].nombre,
    precio: producto ? String(producto.precio) : '',
    stock: producto ? String(producto.stock) : '0',
    icono: producto?.icono ?? '',
  }
}

/** Crear (producto = null) o editar un producto. `onGuardar` hace la llamada y lanza el error si falla. */
export default function FormularioProducto({ producto, onGuardar, onCancelar }) {
  const [form, setForm] = useState(() => formularioDesde(producto))
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function handleChange(evento) {
    const { name, value } = evento.target
    setForm((anterior) => ({ ...anterior, [name]: value }))
  }

  async function handleSubmit(evento) {
    evento.preventDefault()
    if (enviando) return

    const nuevosErrores = validarProducto(form)
    setErrores(nuevosErrores)
    setErrorGeneral('')
    if (Object.keys(nuevosErrores).length > 0) return

    setEnviando(true)
    try {
      await onGuardar({
        nombre: form.nombre.trim(),
        categoria: form.categoria,
        precio: Number(form.precio),
        stock: Number(form.stock),
        icono: form.icono.trim(),
      })
    } catch (error) {
      const { campos, general } = erroresDeServidor(error, CAMPOS)
      setErrores(campos)
      setErrorGeneral(general)
      setEnviando(false)
    }
  }

  return (
    <form className={formularioTarjeta} onSubmit={handleSubmit} noValidate aria-label={producto ? 'Editar producto' : 'Nuevo producto'}>
      <h2 className={tituloTarjeta}>{producto ? 'Editar producto' : 'Nuevo producto'}</h2>

      <CampoFormulario id="producto-nombre" name="nombre" label="Nombre *" value={form.nombre} onChange={handleChange} error={errores.nombre} />

      <div className={filaCampos}>
        <CampoFormulario id="producto-categoria" name="categoria" label="Categoría *" value={form.categoria} onChange={handleChange} error={errores.categoria}>
          {categorias.map((c) => (
            <option key={c.slug} value={c.nombre}>{c.nombre}</option>
          ))}
        </CampoFormulario>
        <CampoFormulario id="producto-icono" name="icono" label="Icono *" value={form.icono} onChange={handleChange} placeholder="🎸" error={errores.icono} />
      </div>

      <div className={filaCampos}>
        <CampoFormulario id="producto-precio" name="precio" label="Precio (CLP) *" type="number" value={form.precio} onChange={handleChange} error={errores.precio} />
        <CampoFormulario id="producto-stock" name="stock" label="Stock *" type="number" value={form.stock} onChange={handleChange} error={errores.stock} />
      </div>

      {errorGeneral && (
        <p role="alert" className={`m-0 ${campoError}`}>
          {errorGeneral}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={enviando} className={enviando ? botonPrincipalDeshabilitado : botonPrincipal}>
          {enviando ? 'Guardando…' : producto ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <button type="button" onClick={onCancelar} className={botonSecundario}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
