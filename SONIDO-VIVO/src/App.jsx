import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { SearchBar } from './components/Search-Bar.jsx';
import {Banner} from './components/Banner.jsx';
import {ProductosDestacados} from './components/Productos-Destacados.jsx';
import {Cuotas} from './components/Cuotas.jsx';
import CatalogoProductos from './CatalogoProductos.jsx';

function App() {
  if (window.location.pathname.endsWith('/productos.html')) {
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

  return (
    <>
    <Header/>
    <SearchBar/>
    <Banner/>
    <Cuotas/>
    <ProductosDestacados/>
    <Footer/>
    </>
  )
}

export default App
