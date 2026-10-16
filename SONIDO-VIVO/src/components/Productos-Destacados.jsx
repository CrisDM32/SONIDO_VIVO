import { useRef } from 'react'
import Producto1 from '../images/producto1.png'
import { productos } from '../data/productos.js'

export const ProductosDestacados = () => {
    const productListRef = useRef(null)

    const desplazarCarrusel = (direccion) => {
        const productList = productListRef.current
        if (!productList) return

        const productCard = productList.querySelector('.product-item')
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
        
    <main className="main-content">
        <div>
            <p className="section-title-productos"><b>Productos Destacados</b></p>
        </div>
        <div className="products-section">
                <button
                    className="flecha"
                    type="button"
                    aria-label="Ver productos anteriores"
                    onClick={() => desplazarCarrusel(-1)}
                >
                    &#8249;
                </button>
                <div className="product-list" id="product-list" ref={productListRef}>
                    {productos.map((producto) => (
                        <a href="producto-1.html" className="product-item" key={producto.nombre}>
                            <img src={Producto1} alt={producto.nombre} className="producto1"></img>
                            <h3>{producto.nombre}</h3>
                            <p>{producto.precio}</p>
                            <button className="carrito-button" type="button">
                                Añadir al carrito
                            </button>
                        </a>
                    ))}
                </div>
                <button
                    className="flecha"
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