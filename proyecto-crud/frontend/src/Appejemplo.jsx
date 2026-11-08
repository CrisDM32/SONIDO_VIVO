import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { RutaPrivada, RutaPublica } from './components/Rutas'
import { SesionProvider, useSesion } from './context/Sesion'
import FormularioProducto from './pages/FormularioProducto'
import InicioSesion from './pages/InicioSesion'
import ListaProductos from './pages/ListaProductos'

const RutaDesconocida = () => {
  const { activa } = useSesion()
  return <Navigate to={activa ? '/' : '/login'} replace />
}

const App = () => {
  return (
    <SesionProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RutaPublica />}>
            <Route path="/login" element={<InicioSesion />} />
          </Route>
          <Route element={<RutaPrivada />}>
            <Route element={<Layout />}>
              <Route path="/" element={<ListaProductos />} />
              <Route path="/productos/nuevo" element={<FormularioProducto />} />
              <Route path="/productos/:id/editar" element={<FormularioProducto />} />
            </Route>
          </Route>
          <Route path="*" element={<RutaDesconocida />} />
        </Routes>
      </BrowserRouter>
    </SesionProvider>
  )
}

export default App
