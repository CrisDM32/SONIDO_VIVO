import { Link, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/Sesion'

const Header = () => {
  const { usuario, cerrar } = useSesion()
  const navigate = useNavigate()

  const salir = () => {
    cerrar()
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-teal-800 text-sm text-white">A</span>
            Almacén
          </Link>
          <nav className="flex items-center gap-5 text-sm" aria-label="Principal">
            <Link to="/" className="font-medium text-stone-900">Productos</Link>
            <span className="text-stone-400" title="Sección de ejemplo">Categorías</span>
            <span className="text-stone-400" title="Sección de ejemplo">Reportes</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-stone-900">{usuario?.nombre}</p>
            <p className="text-xs text-stone-500">{usuario?.perfil}</p>
          </div>
          <button type="button" onClick={salir} className="text-sm font-medium text-stone-600 hover:text-stone-900">
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
