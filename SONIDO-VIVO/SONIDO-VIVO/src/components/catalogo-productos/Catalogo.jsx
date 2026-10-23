import Producto1 from '../../images/producto1.png'
import { productos } from '../../data/productos.js'
import { Header } from './Header.jsx'
import { Footer } from './Footer.jsx'

export const Catalogo = () => (
    <>
        <Header />
        <main className="catalogo-page">
            <h1 className="section-title-productos">Todos los productos</h1>
            <div className="catalogo-grid">
                {productos.map((producto) => (
                    <article className="catalogo-card" key={producto.nombre}>
                        <img src={Producto1} alt={producto.nombre} />
                        <h2>{producto.nombre}</h2>
                        <p>{producto.precio}</p>
                        <button className="carrito-button" type="button">
                            Añadir al carrito
                        </button>
                    </article>
                ))}
            </div>
        </main>
        <Footer />
    </>
)
