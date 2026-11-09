/**
 * Traduce un error del backend a errores por campo del formulario.
 * `errores` (validación) o `campo` (dato duplicado/inválido) apuntan a un campo; si no, es un error general.
 */
export function erroresDeServidor(error, camposConocidos) {
  if (error.errores) {
    return { campos: error.errores, general: '' }
  }
  if (error.campo && camposConocidos.includes(error.campo)) {
    return { campos: { [error.campo]: error.message }, general: '' }
  }
  return { campos: {}, general: error.message }
}
