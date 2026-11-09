import { agregarAlCarrito, formatearPrecioCLP } from '../../utils/carrito.js'
import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import Producto1 from '../../images/producto1.png'
import { useProductos } from '../../hooks/useProductos.jsx'
import { botonCarrito, tituloSeccion } from '../../styles/clases.js'

const flecha = 'flex-none cursor-pointer border-none bg-transparent text-[50px] text-ink mobile:px-1 mobile:py-0 mobile:text-[36px]'
const tarjeta =
    'flex-[0_0_250px] snap-start rounded-[10px] bg-button p-[30px] text-center text-paper no-underline transition-transform duration-300 ease-[ease] hover:scale-105 tablet:basis-[220px] tablet:p-[22px] mobile:flex-[0_0_min(220px,calc(100vw_-_100px))] mobile:p-[18px]'

export const ProductosDestacados = () => {
    const productListRef = useRef(null)
    const [agregados, setAgregados] = useState({})
    const { productos, estado } = useProductos()

    const agregarProducto = (producto) => {
        agregarAlCarrito(producto)
        setAgregados((anterior) => ({ ...anterior, [producto.id]: true }))
        setTimeout(() => {
            setAgregados((anterior) => ({ ...anterior, [producto.id]: false }))
        }, 1000)
    }

    const desplazarCarrusel = (direccion) => {
        const productList = productListRef.current
        if (!productList) return

        const productCard = productList.querySelector('article')
        if (!productCard) return

        const gap = Number.parseFloat(getComputedStyle(productList).columnGap) || 0
        const maxScroll = productList.scrollWidth - productList.clientWidth
        const atStart = productList.scrollLeft <= 1
        const atEnd = productList.scrollLeft >= maxScroll - 1

        if ((direccion > 0 && atEnd) || (direccion < 0 && atStart)) {
            productList.scrollTo({
                left: direccion > 0 ? 0 : maxScroll,
                behavior: 'smooth',
            })
            return
        }

        productList.scrollTo({
            left: productList.scrollLeft + direccion * (productCard.getBoundingClientRect().width + gap),
            behavior: 'smooth',
        })
    }

    return (
        
    <main>
        <div>
            <p className={tituloSeccion}><b>Productos Destacados</b></p>
            {estado === 'ERROR' && <p role="alert" className="text-center">No se han cargado los productos</p>}
        </div>
        <div className="m-auto flex w-full max-w-[1200px] items-center gap-2.5 px-2.5 tablet:gap-1 tablet:px-2 mobile:gap-0 mobile:px-1">
                <button
                    className={flecha}
                    type="button"
                    aria-label="Ver productos anteriores"
                    onClick={() => desplazarCarrusel(-1)}
                >
                    &#8249;
                </button>
                <div className="mb-[50px] flex w-full min-w-0 snap-x snap-mandatory flex-nowrap gap-5 overflow-x-auto scroll-smooth no-underline [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mobile:mb-8 mobile:gap-3" id="product-list" ref={productListRef}>
                    {productos.map((producto) => (
                        <article className={tarjeta} key={producto.id}>
                            <Link to={`/producto/${producto.id}`} className="block text-inherit no-underline">
                                <img src={Producto1} alt={producto.nombre} className="h-auto max-w-full rounded-sv"></img>
                                <h3>{producto.nombre}</h3>
                                <p>{formatearPrecioCLP(producto.precio)}</p>
                            </Link>
                            <button
                                className={botonCarrito}
                                type="button"
                                disabled={!producto.disponible}
                                onClick={() => agregarProducto(producto)}
                            >
                                {!producto.disponible ? 'Agotado' : agregados[producto.id] ? '¡Agregado! ✓' : 'Añadir al carrito'}
                            </button>
                        </article>
                    ))}
                </div>
                <button
                    className={flecha}
                    type="button"
                    aria-label="Ver más productos"
                    onClick={() => desplazarCarrusel(1)}
                >
                    &#8250;
                </button>
        </div>
    </main>
    )
}