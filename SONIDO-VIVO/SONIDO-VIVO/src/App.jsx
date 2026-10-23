import { Header } from './components/generales/Header.jsx';
import { Footer } from './components/generales/Footer.jsx';
import { SearchBar } from './components/pagina-inicio/Search-Bar.jsx';
import { Banner } from './components/generales/Banner.jsx';
import { ProductosDestacados } from './components/pagina-inicio/Productos-Destacados.jsx';
import { Cuotas } from './components/pagina-inicio/Cuotas.jsx';
import CatalogoProductos from './pages/CatalogoProductos.jsx';
import Carrito from './pages/Carrito.jsx';
import Contacto from './pages/Contacto.jsx';
import Pago from './pages/Pago.jsx';
import Resumen from './pages/Resumen.jsx';
import PagoTarjeta from './pages/PagoTarjeta.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';

function App() {
  const pathname = window.location.pathname;

  if (pathname.endsWith('/productos.html')) {
    return (
      <>
        <Header />
        <main className="catalogo-page">
          <h1 className="section-title-productos">Todos los productos</h1>
          <CatalogoProductos />
        </main>
        <Footer />
      </>
    )
  }

  if (pathname.endsWith('/carrito.html')) {
    return (
      <>
        <Header />
        <Carrito />
        <Footer />
      </>
    )
  }

  if (pathname.endsWith('/contacto.html')) {
    return (
      <>
        <Header />
        <Contacto />
        <Footer />
      </>
    )
  }

  if (pathname.endsWith('/pago.html')) {
    return (
      <>
        <Header />
        <Pago />
        <Footer />
      </>
    )
  }

  if (pathname.endsWith('/pago-tarjeta.html')) {
    return (
      <>
        <Header />
        <PagoTarjeta />
        <Footer />
      </>
    )
  }

  if (pathname.endsWith('/resumen.html')) {
    return (
      <>
        <Header />
        <Resumen />
        <Footer />
      </>
    )
  }

  if (pathname.endsWith('/iniciar-sesion.html')) {
    return (
      <>
        <Header />
        <Login />
        <Footer />
      </>
    )
  }

  if (pathname.endsWith('/registro.html')) {
    return (
      <>
        <Header />
        <Registro />
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <SearchBar />
      <Banner />
      <Cuotas />
      <ProductosDestacados />
      <Footer />
    </>
  )
}

export default App
