export function validarRegistro(form) {
  const nuevosErrores = {}

  if (form.nombre.trim().length < 3) {
    nuevosErrores.nombre = 'Escribe tu nombre completo (mínimo 3 caracteres).'
  }

  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formatoEmail.test(form.email.trim())) {
    nuevosErrores.email = 'Ingresa un correo electrónico válido.'
  }

  if (form.telefono.trim() !== '') {
    const soloDigitos = form.telefono.replace(/[^0-9]/g, '')
    const formatoTelefono = /^[0-9+\s-]+$/
    if (!formatoTelefono.test(form.telefono) || soloDigitos.length < 8) {
      nuevosErrores.telefono = 'El teléfono no es válido (mínimo 8 dígitos).'
    }
  }

  const tieneLetra = /[a-zA-Z]/.test(form.password)
  const tieneNumero = /[0-9]/.test(form.password)
  if (form.password.length < 8 || !tieneLetra || !tieneNumero) {
    nuevosErrores.password = 'La contraseña debe tener 8+ caracteres, con letras y números.'
  }

  if (form.password2 !== form.password || form.password2 === '') {
    nuevosErrores.password2 = 'Las contraseñas no coinciden.'
  }

  if (!form.terminos) {
    nuevosErrores.terminos = 'Debes aceptar los términos y condiciones.'
  }

  return nuevosErrores
}
