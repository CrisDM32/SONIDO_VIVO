export function validarPagoTarjeta(form, hoy = new Date()) {
  const nuevosErrores = {}

  if (form.nombreTitular.trim().length < 3) {
    nuevosErrores.nombreTitular = 'Escribe el nombre del titular (mínimo 3 caracteres).'
  } else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'.-]+$/.test(form.nombreTitular.trim())) {
    nuevosErrores.nombreTitular = 'El nombre del titular solo puede contener letras.'
  }

  const numero = form.numeroTarjeta.replace(/\s/g, '')
  if (!/^[0-9]{13,19}$/.test(numero)) {
    nuevosErrores.numeroTarjeta = 'Ingresa un número de tarjeta válido (13 a 19 dígitos).'
  }

  const formatoFecha = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(form.fechaVencimiento)
  if (!formatoFecha) {
    nuevosErrores.fechaVencimiento = 'Selecciona la fecha de vencimiento.'
  } else {
    const anio = Number(formatoFecha[1])
    const mes = Number(formatoFecha[2])
    const vencida =
      anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)
    if (vencida) {
      nuevosErrores.fechaVencimiento = 'La tarjeta está vencida.'
    }
  }

  if (!/^[0-9]{3,4}$/.test(form.ccv)) {
    nuevosErrores.ccv = 'El CCV debe tener 3 o 4 dígitos.'
  }

  return nuevosErrores
}
