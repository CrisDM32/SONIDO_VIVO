import { regionesChile } from '../data/regionesChile.js'

export function validarPerfil(form) {
  const nuevosErrores = {}

  if (form.telefono.trim() !== '') {
    const soloDigitos = form.telefono.replace(/[^0-9]/g, '')
    if (!/^[0-9+\s-]+$/.test(form.telefono) || soloDigitos.length < 8) {
      nuevosErrores.telefono = 'Ingresa un teléfono válido (mínimo 8 dígitos).'
    }
  }

  if (form.direccion.trim() !== '' && form.direccion.trim().length < 5) {
    nuevosErrores.direccion = 'Escribe tu dirección (calle y número).'
  }

  if (!regionesChile[form.region]) {
    nuevosErrores.region = 'Selecciona una región.'
  } else if (!regionesChile[form.region].includes(form.comuna)) {
    nuevosErrores.comuna = 'Selecciona una comuna.'
  }

  return nuevosErrores
}
