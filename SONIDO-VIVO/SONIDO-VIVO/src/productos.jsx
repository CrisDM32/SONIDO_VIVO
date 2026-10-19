import { createRoot } from 'react-dom/client'
import CatalogoProductos from './CatalogoProductos.jsx'

const catalogo = document.getElementById('catalogoReact')

if (!catalogo) {
  throw new Error('No se encontró el contenedor React del catálogo.')
}

createRoot(catalogo).render(<CatalogoProductos />)
