import { Header } from './components/header.jsx';
import { Footer } from './components/Footer.jsx';
import { SearchBar } from './components/Search-Bar.jsx';
import {Banner} from './components/Banner.jsx';
import {ProductosDestacados} from './components/Productos-Destacados.jsx';
import {Cuotas} from './components/Cuotas.jsx';

function App() {
    

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
