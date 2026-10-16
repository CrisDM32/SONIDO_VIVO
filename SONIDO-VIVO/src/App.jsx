import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { SearchBar } from './components/Search-Bar.jsx';
import {Banner} from './components/Banner.jsx';
import {ProductosDestacados} from './components/Productos-Destacados.jsx';
import {Cuotas} from './components/Cuotas.jsx';
import { Catalogo } from './components/Catalogo.jsx';

function App() {
  if (window.location.pathname.endsWith('/productos.html')) {
    return <Catalogo />
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
