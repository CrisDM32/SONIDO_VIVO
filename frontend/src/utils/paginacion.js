export const OPCIONES_TAMANO = [6, 12, 24, 48]
export const TAMANO_INICIAL = 12

export function paginar(lista, pagina, tamano) {
  const total = lista.length
  const totalPaginas = Math.max(1, Math.ceil(total / tamano))
  const actual = Math.min(Math.max(1, pagina), totalPaginas)
  const inicio = (actual - 1) * tamano
  const items = lista.slice(inicio, inicio + tamano)

  return {
    items,
    total,
    totalPaginas,
    pagina: actual,
    desde: total === 0 ? 0 : inicio + 1,
    hasta: inicio + items.length,
  }
}

export function numerosDePagina(actual, totalPaginas) {
  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1)
  }

  const visibles = new Set([1, totalPaginas, actual - 1, actual, actual + 1])
  if (actual <= 3) [2, 3, 4].forEach((n) => visibles.add(n))
  if (actual >= totalPaginas - 2) [totalPaginas - 3, totalPaginas - 2, totalPaginas - 1].forEach((n) => visibles.add(n))

  const ordenados = [...visibles].filter((n) => n >= 1 && n <= totalPaginas).sort((a, b) => a - b)
  const resultado = []
  ordenados.forEach((n, i) => {
    const salto = i > 0 ? n - ordenados[i - 1] : 1
    if (salto === 2) resultado.push(n - 1)
    if (salto > 2) resultado.push('…')
    resultado.push(n)
  })
  return resultado
}
