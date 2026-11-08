import { SearchBar } from '../components/pagina-inicio/Search-Bar.jsx'
import { Banner } from '../components/generales/Banner.jsx'
import { Cuotas } from '../components/pagina-inicio/Cuotas.jsx'
import { ProductosDestacados } from '../components/pagina-inicio/Productos-Destacados.jsx'

export default function Inicio() {
  return (
    <>
      <SearchBar />
      <Banner />
      <Cuotas />
      <ProductosDestacados />
    </>
  )
}
