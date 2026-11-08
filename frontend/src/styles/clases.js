// Clases de Tailwind que se repiten en varios componentes.
// Los valores replican exactamente el diseño original de Sonido Vivo.

// Título principal de una página que NO está dentro de un contenedor ancho
export const tituloSeccion =
  'p-5 text-center text-[50px] tablet:text-[clamp(36px,6vw,50px)] mobile:px-2 mobile:py-4 mobile:text-[clamp(30px,8vw,42px)]'

// Título principal dentro de <main className="contenedor-ancho">
export const tituloPagina =
  'p-5 text-center text-[50px] tablet:text-[clamp(36px,6vw,50px)] mobile:px-0 mobile:pt-3 mobile:pb-5 mobile:text-[clamp(32px,8vw,44px)]'

// Botón oscuro "Añadir al carrito" / "Agregar al carrito"
export const botonCarrito =
  'cursor-pointer rounded-sv border-none bg-header px-5 py-2.5 text-[16px] text-paper transition-[transform,opacity] duration-200 ease-[ease]'

// Contenedor central de las páginas internas (<main>)
export const contenedorAncho = 'mx-auto mb-12 w-full max-w-[1000px] px-[clamp(16px,3vw,28px)]'

// Campo de búsqueda (inicio y catálogo)
export const inputBuscar =
  'mr-2.5 w-1/2 min-w-0 rounded-sv border-4 border-solid border-[#020202] bg-header p-2.5 text-white mobile:w-full mobile:border-2'

// Botones principal / secundario (iguales; el principal puede estar deshabilitado)
const botonBase =
  'inline-flex min-h-11 items-center justify-center rounded-sv border border-solid border-paper bg-header px-5 py-2.5 [font-family:inherit] [font-size:inherit] [line-height:inherit] font-semibold text-paper no-underline transition-[background-color,transform,translate] duration-200 ease-[ease]'
const botonHover = 'cursor-pointer hover:-translate-y-px hover:bg-[#555]'
export const botonSecundario = `${botonBase} ${botonHover}`
export const botonPrincipal = `${botonBase} ${botonHover}`
export const botonPrincipalDeshabilitado = `${botonBase} cursor-not-allowed opacity-[0.55]`

// Línea "Total: $X" y su monto
export const lineaTotal =
  'mt-[18px] flex items-center justify-between gap-3 text-[18px] *:min-w-0 mobile:gap-2 mobile:text-[16px]'
export const montoTotal = 'text-[22px] font-bold mobile:text-[19px]'

// ---------- Formularios ----------
export const campo = 'grid gap-2'
export const campoEtiqueta = 'font-semibold text-ink'
export const campoError = 'text-[13px] font-semibold text-[#b42318]'
const campoControl =
  'min-h-[46px] w-full rounded-lg border border-solid px-3 py-2.5 text-ink [font:inherit] focus:outline-2 focus:outline-[rgb(59_58_58/25%)]'
// (si el campo es inválido, el borde rojo no cambia al enfocarlo)
export const campoInput = (invalido) =>
  `${campoControl} ${invalido ? 'border-[#c92d2d] bg-[#fff5f5]' : 'border-[#bbb] bg-white focus:border-button'}`
export const campoTextarea = (invalido) =>
  `w-full resize-y rounded-lg border border-solid p-3 [font:inherit] ${invalido ? 'border-[#c92d2d] bg-[#fff5f5]' : 'border-[#c8c8c8]'}`
export const mensajeExito = 'm-0 rounded-lg bg-[#eafaf1] px-4 py-3.5 font-semibold text-[#1f6d3a]'
export const filaCampos = 'grid grid-cols-2 gap-[18px] mobile:grid-cols-[1fr] mini:gap-3.5'
export const formularioCheckout = 'grid gap-[18px]'

// Páginas de login y registro
export const contenedorFormulario = 'mx-auto mt-12 mb-16 max-w-[760px] px-5'
export const tituloFormulario = 'm-0 text-[clamp(34px,5vw,52px)] text-ink'
export const subtituloFormulario = 'mt-3 mb-6 text-[18px] text-[#2a2a2a]'

// ---------- Tarjetas y disposición del checkout ----------
const tarjetaBase = 'rounded-xl border border-[rgb(18_18_18/10%)] shadow-[0_4px_16px_rgb(18_18_18/8%)]'
export const tarjetaClara = `${tarjetaBase} bg-paper`
export const formularioTarjeta = `grid gap-[18px] ${tarjetaClara} p-7 mobile:px-4 mobile:py-5`
export const tarjetaCheckout = `${tarjetaBase} p-7 tablet:p-[22px] mobile:px-4 mobile:py-5`
export const tarjetaCheckoutClara = `${tarjetaCheckout} bg-paper`
export const tarjetaCheckoutOscura = `${tarjetaCheckout} bg-button text-paper`
export const tituloTarjeta = 'mt-0 text-[28px] text-ink'
export const tituloTarjetaOscura = 'mt-0 text-[28px] text-paper'

export const contenedorCheckout = 'mx-auto mb-12 w-full max-w-[1200px] px-[clamp(16px,3vw,28px)]'
const layoutCheckout = 'grid items-start gap-6 *:min-w-0 tablet:gap-[18px]'
export const layoutCheckoutDos = `${layoutCheckout} grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)] tablet:grid-cols-[minmax(0,1.25fr)_minmax(240px,0.85fr)] mobile:grid-cols-[minmax(0,1fr)]`
export const layoutCheckoutSimple = `${layoutCheckout} grid-cols-[minmax(0,640px)] justify-center`

// Líneas del resumen de pedido (versión oscura y clara)
const resumenItem =
  'flex justify-between gap-3 border-b py-2.5 [&>:first-child]:min-w-0 [&>:first-child]:[overflow-wrap:anywhere] mobile:items-start mobile:text-[14px] mobile:[&>:last-child]:flex-none mobile:[&>:last-child]:text-right'
export const resumenItemOscuro = `${resumenItem} border-[rgb(255_255_255/20%)]`
export const resumenItemClaro = `${resumenItem} border-[rgb(18_18_18/14%)] text-ink`
export const resumenVacio = 'm-0 opacity-80'
export const enlaceSubrayado = 'font-bold text-ink decoration-2 underline-offset-[3px]'
