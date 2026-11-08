export function validarLogin(form) {
  const nuevosErrores = {}

  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formatoEmail.test(form.email.trim())) {
    nuevosErrores.email = 'Ingresa un correo electrónico válido.'
  }

  if (form.password === '') {
    nuevosErrores.password = 'Ingresa tu contraseña.'
  }

  return nuevosErrores
}
