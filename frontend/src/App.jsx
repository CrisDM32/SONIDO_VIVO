import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { categorias } from './data/categorias.js'
import Layout from './components/generales/Layout.jsx'
import { tituloSeccion } from './styles/clases.js'
import Inicio from './pages/Inicio.jsx'
import CatalogoProductos from './pages/CatalogoProductos.jsx'
import Producto from './pages/Producto.jsx'
import Carrito from './pages/Carrito.jsx'
import Contacto from './pages/Contacto.jsx'
import Pago from './pages/Pago.jsx'
import PagoTarjeta from './pages/PagoTarjeta.jsx'
import Resumen from './pages/Resumen.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import PreguntasFrecuentes from './pages/PreguntasFrecuentes.jsx'
import Garantia from './pages/Garantia.jsx'
import ServicioTecnico from './pages/ServicioTecnico.jsx'
import TerminosCondiciones from './pages/TerminosCondiciones.jsx'
import PoliticasPrivacidad from './pages/PoliticasPrivacidad.jsx'

const PaginaCatalogo = () => {
  const { categoria: slug } = useParams()
  const categoria = categorias.find((c) => c.slug === slug)

  if (slug && !categoria) {
    return <Navigate to="/productos" replace />
  }

  return (
    <main className="mx-auto w-[min(1200px,100%)] px-[clamp(16px,3vw,28px)] py-5 mobile:pt-2">
      <h1 className={tituloSeccion}>
        {categoria ? categoria.nombre : 'Todos los productos'}
      </h1>
      <CatalogoProductos key={slug} categoria={categoria?.nombre} />
    </main>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<PaginaCatalogo />} />
          <Route path="/productos/:categoria" element={<PaginaCatalogo />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/pago-tarjeta" element={<PagoTarjeta />} />
          <Route path="/resumen" element={<Resumen />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
          <Route path="/garantia" element={<Garantia />} />
          <Route path="/servicio-tecnico" element={<ServicioTecnico />} />
          <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
          <Route path="/politicas-privacidad" element={<PoliticasPrivacidad />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
