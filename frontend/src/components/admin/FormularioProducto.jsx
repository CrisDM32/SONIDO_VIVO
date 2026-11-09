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

const CAMPOS = ['codigo', 'nombre', 'categoria', 'marca', 'modelo', 'descripcion', 'precio', 'stock', 'icono']

function formularioDesde(producto) {
  return {
    codigo: producto?.codigo ?? '',
    nombre: producto?.nombre ?? '',
    categoria: producto?.categoria ?? categorias[0].nombre,
    marca: producto?.marca ?? '',
    modelo: producto?.modelo ?? '',
    descripcion: producto?.descripcion ?? '',
    precio: producto ? String(producto.precio) : '',
    stock: producto ? String(producto.stock) : '0',
    icono: producto?.icono ?? '',
    destacado: producto?.destacado ?? false,
  }
}

/** Crear (producto = null) o editar un producto. `onGuardar` hace la llamada y lanza el error si falla. */
export default function FormularioProducto({ producto, onGuardar, onCancelar }) {
  const [form, setForm] = useState(() => formularioDesde(producto))
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function handleChange(evento) {
    const { name, value, type, checked } = evento.target
    setForm((anterior) => ({ ...anterior, [name]: type === 'checkbox' ? checked : value }))
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
        codigo: form.codigo.trim(),
        nombre: form.nombre.trim(),
        categoria: form.categoria,
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        stock: Number(form.stock),
        icono: form.icono.trim(),
        destacado: form.destacado,
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

      <div className={filaCampos}>
        <CampoFormulario id="producto-codigo" name="codigo" label="Código *" value={form.codigo} onChange={handleChange} placeholder="GA001" error={errores.codigo} />
        <CampoFormulario id="producto-nombre" name="nombre" label="Nombre *" value={form.nombre} onChange={handleChange} error={errores.nombre} />
      </div>

      <div className={filaCampos}>
        <CampoFormulario id="producto-categoria" name="categoria" label="Categoría *" value={form.categoria} onChange={handleChange} error={errores.categoria}>
          {categorias.map((c) => (
            <option key={c.slug} value={c.nombre}>{c.nombre}</option>
          ))}
        </CampoFormulario>
        <CampoFormulario id="producto-icono" name="icono" label="Icono *" value={form.icono} onChange={handleChange} placeholder="🎸" error={errores.icono} />
      </div>

      <div className={filaCampos}>
        <CampoFormulario id="producto-marca" name="marca" label="Marca" value={form.marca} onChange={handleChange} error={errores.marca} />
        <CampoFormulario id="producto-modelo" name="modelo" label="Modelo" value={form.modelo} onChange={handleChange} error={errores.modelo} />
      </div>

      <CampoFormulario id="producto-descripcion" name="descripcion" label="Descripción" rows={3} value={form.descripcion} onChange={handleChange} error={errores.descripcion} />

      <div className={filaCampos}>
        <CampoFormulario id="producto-precio" name="precio" label="Precio (CLP) *" type="number" value={form.precio} onChange={handleChange} error={errores.precio} />
        <CampoFormulario id="producto-stock" name="stock" label="Stock *" type="number" value={form.stock} onChange={handleChange} error={errores.stock} />
      </div>

      <label className="flex items-center gap-2.5 font-semibold text-ink">
        <input type="checkbox" name="destacado" className="size-[18px]" checked={form.destacado} onChange={handleChange} />
        Producto destacado (aparece en el carrusel del inicio)
      </label>

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
