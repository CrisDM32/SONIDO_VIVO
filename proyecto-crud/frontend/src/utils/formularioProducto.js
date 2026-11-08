export const textoNumero = (valor) => {
  if (valor === null || valor === undefined) return ''
  const numero = Number(valor)
  return Number.isNaN(numero) ? String(valor) : String(numero)
}

export const payloadProducto = (form) => {
  return {
    imagen: form.imagen.trim(),
    nombre: form.nombre.trim(),
    stock: Number(form.stock.trim()),
    precio: Number(form.precio.trim().replace(',', '.')).toFixed(2),
  }
}
