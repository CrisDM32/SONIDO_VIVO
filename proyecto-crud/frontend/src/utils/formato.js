export const formatoPrecio = (valor) => {
  const numero = Number(valor)
  if (Number.isNaN(numero)) return '—'
  const decimales = Number.isInteger(numero) ? 0 : 2
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(numero)
}
