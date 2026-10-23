import { regionesChile } from '../data/regionesChile.js'

function rutValido(rut) {
  const limpio = rut.replace(/[.\s-]/g, '').toUpperCase()
  if (!/^[0-9]{7,8}[0-9K]$/.test(limpio)) return false

  const cuerpo = limpio.slice(0, -1)
  const digito = limpio.slice(-1)

  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return digito === esperado
}

export function validarEnvio(form) {
  const nuevosErrores = {}

  if (form.nombre.trim().length < 3) {
    nuevosErrores.nombre = 'Escribe tu nombre completo (mínimo 3 caracteres).'
  }

  if (!rutValido(form.rut)) {
    nuevosErrores.rut = 'Ingresa un RUT válido (ej: 12.345.678-5).'
  }

  const soloDigitos = form.telefono.replace(/[^0-9]/g, '')
  const formatoTelefono = /^[0-9+\s-]+$/
  if (!formatoTelefono.test(form.telefono) || soloDigitos.length < 8) {
    nuevosErrores.telefono = 'Ingresa un teléfono válido (mínimo 8 dígitos).'
  }

  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formatoEmail.test(form.correo.trim())) {
    nuevosErrores.correo = 'Ingresa un correo electrónico válido.'
  }

  if (form.direccion.trim().length < 5) {
    nuevosErrores.direccion = 'Escribe tu dirección (calle y número).'
  }

  if (!regionesChile[form.region]) {
    nuevosErrores.region = 'Selecciona una región.'
  } else if (!regionesChile[form.region].includes(form.comuna)) {
    nuevosErrores.comuna = 'Selecciona una comuna.'
  }

  return nuevosErrores
}
