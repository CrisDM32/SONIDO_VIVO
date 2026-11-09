import { rutValido } from './validacionEnvio.js'

// Alta de personal (administrador o vendedor). Mismas reglas que el registro de clientes.
export function validarPersonal(form) {
  const errores = {}

  if (form.nombre.trim().length < 3) {
    errores.nombre = 'Escribe el nombre completo (mínimo 3 caracteres).'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
    errores.correo = 'Ingresa un correo electrónico válido.'
  }

  if (!rutValido(form.rut)) {
    errores.rut = 'Ingresa un RUT válido (ej: 12.345.678-5).'
  }

  if (form.telefono.trim() !== '') {
    const digitos = form.telefono.replace(/[^0-9]/g, '')
    if (!/^[0-9+\s-]+$/.test(form.telefono) || digitos.length < 8) {
      errores.telefono = 'El teléfono no es válido (mínimo 8 dígitos).'
    }
  }

  if (form.clave.length < 8 || !/[a-zA-Z]/.test(form.clave) || !/[0-9]/.test(form.clave)) {
    errores.clave = 'La contraseña debe tener 8+ caracteres, con letras y números.'
  }

  if (!['administrador', 'vendedor'].includes(form.perfil)) {
    errores.perfil = 'Selecciona un perfil.'
  }

  return errores
}
