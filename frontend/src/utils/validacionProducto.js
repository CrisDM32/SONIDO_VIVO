import { categorias } from '../data/categorias.js'

// Mismas reglas que valida el backend (ProductoRequest).
export function validarProducto(form) {
  const errores = {}

  const codigo = form.codigo.trim()
  if (codigo.length < 3 || codigo.length > 20) {
    errores.codigo = 'El código debe tener entre 3 y 20 caracteres.'
  }

  const nombre = form.nombre.trim()
  if (nombre.length < 3 || nombre.length > 120) {
    errores.nombre = 'El nombre debe tener entre 3 y 120 caracteres.'
  }

  if (!categorias.some((c) => c.nombre === form.categoria)) {
    errores.categoria = 'Selecciona una categoría.'
  }

  const precio = Number(form.precio)
  if (form.precio === '' || !Number.isInteger(precio) || precio < 1) {
    errores.precio = 'El precio debe ser un número entero mayor que 0.'
  }

  const stock = Number(form.stock)
  if (form.stock === '' || !Number.isInteger(stock) || stock < 0) {
    errores.stock = 'El stock debe ser un número entero, 0 o más.'
  }

  if (form.marca.trim().length > 60) errores.marca = 'La marca es demasiado larga (máximo 60).'
  if (form.modelo.trim().length > 60) errores.modelo = 'El modelo es demasiado largo (máximo 60).'
  if (form.descripcion.trim().length > 500) errores.descripcion = 'La descripción es demasiado larga (máximo 500).'

  if (form.icono.trim() === '') {
    errores.icono = 'Ingresa un icono (por ejemplo 🎸).'
  }

  return errores
}
