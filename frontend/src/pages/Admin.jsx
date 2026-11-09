import { useState } from 'react'
import AdminProductos from '../components/admin/AdminProductos.jsx'
import AdminUsuarios from '../components/admin/AdminUsuarios.jsx'
import { useSesion } from '../hooks/useSesion.js'
import { contenedorAncho, tituloPagina } from '../styles/clases.js'

const pestana = (activa) =>
  `cursor-pointer rounded-t-lg border border-b-0 border-solid border-[rgb(18_18_18/20%)] px-5 py-2.5 text-[16px] font-semibold [font-family:inherit] ${
    activa ? 'bg-button text-paper' : 'bg-paper text-ink hover:bg-[#efeded]'
  }`

export default function Admin() {
  const { usuario, cerrar } = useSesion()
  const [vista, setVista] = useState('productos')

  const esAdministrador = usuario.perfil === 'administrador'

  // Si el backend dice 401 (token vencido o usuario eliminado) se cierra la sesión; el resto se muestra como mensaje.
  function manejarError(error) {
    if (error.status === 401) cerrar()
    return error.message
  }

  return (
    <main className={`${contenedorAncho} !max-w-[1200px] pb-10`}>
      <h1 className={tituloPagina}>Panel de administración</h1>

      {esAdministrador && (
        <div role="tablist" aria-label="Secciones del panel" className="mb-4 flex gap-1 border-b border-[rgb(18_18_18/20%)]">
          <button type="button" role="tab" aria-selected={vista === 'productos'} className={pestana(vista === 'productos')} onClick={() => setVista('productos')}>
            Productos
          </button>
          <button type="button" role="tab" aria-selected={vista === 'usuarios'} className={pestana(vista === 'usuarios')} onClick={() => setVista('usuarios')}>
            Usuarios
          </button>
        </div>
      )}

      {vista === 'productos' || !esAdministrador ? (
        <AdminProductos onError={manejarError} />
      ) : (
        <AdminUsuarios onError={manejarError} />
      )}
    </main>
  )
}
