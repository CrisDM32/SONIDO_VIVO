export function validarContacto(form) {
  const nuevosErrores = {}

  if (form.nombre.trim().length < 3) {
    nuevosErrores.nombre = 'Escribe tu nombre completo (mínimo 3 caracteres).'
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

  if (form.motivo.trim().length < 10) {
    nuevosErrores.motivo = 'Describe el motivo de tu consulta (mínimo 10 caracteres).'
  }

  return nuevosErrores
}
