import { useState } from 'react'

const celda = 'px-3 py-2.5 align-middle'
const botonFila =
  'cursor-pointer rounded-sv border border-solid border-button bg-transparent px-3 py-1.5 text-[14px] font-semibold text-button hover:bg-button hover:text-paper'
const botonPeligro =
  'cursor-pointer rounded-sv border border-solid border-[#b42318] bg-transparent px-3 py-1.5 text-[14px] font-semibold text-[#b42318] hover:bg-[#b42318] hover:text-paper disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#b42318]'

function FilaUsuario({ usuario, esYo, onCambiarPerfil, onEliminar }) {
  const [confirmando, setConfirmando] = useState(false)

  return (
    <tr className="border-b border-[rgb(18_18_18/10%)]">
      <td className={celda}>
        <strong>{usuario.nombre}</strong>
        {esYo && <span className="ml-2 text-[13px] text-[#555]">(tú)</span>}
      </td>
      <td className={celda}>{usuario.correo}</td>
      <td className={celda}>{usuario.rut ?? '—'}</td>
      <td className={celda}>{usuario.telefono ?? '—'}</td>
      <td className={celda}>
        <select
          aria-label={`Perfil de ${usuario.nombre}`}
          value={usuario.perfil}
          disabled={esYo}
          onChange={(evento) => onCambiarPerfil(usuario, evento.target.value)}
          className="rounded-lg border border-solid border-[#bbb] bg-white px-2 py-1.5 text-ink disabled:opacity-60"
        >
          <option value="administrador">Administrador</option>
          <option value="vendedor">Vendedor</option>
          <option value="cliente">Cliente</option>
        </select>
      </td>
      <td className={celda}>
        {confirmando ? (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={`Confirmar eliminar ${usuario.nombre}`}>
            <span className="text-[14px]">¿Eliminar?</span>
            <button
              type="button"
              className={botonPeligro}
              onClick={() => {
                setConfirmando(false)
                onEliminar(usuario)
              }}
            >
              Sí, eliminar
            </button>
            <button type="button" className={botonFila} onClick={() => setConfirmando(false)}>
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={botonPeligro}
            disabled={esYo}
            aria-label={`Eliminar ${usuario.nombre}`}
            onClick={() => setConfirmando(true)}
          >
            Eliminar
          </button>
        )}
      </td>
    </tr>
  )
}

export default function TablaUsuarios({ usuarios, correoActual, onCambiarPerfil, onEliminar }) {
  if (usuarios.length === 0) {
    return <p className="m-0 rounded-lg bg-[#efeded] px-4 py-3.5 text-ink">No se encontraron usuarios.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-ink">
        <thead>
          <tr className="border-b-2 border-[rgb(18_18_18/20%)] text-[14px]">
            <th className={celda}>Nombre</th>
            <th className={celda}>Correo</th>
            <th className={celda}>RUT</th>
            <th className={celda}>Teléfono</th>
            <th className={celda}>Perfil</th>
            <th className={celda}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <FilaUsuario
              // La clave incluye el perfil para que el selector refleje siempre lo que confirmó el servidor.
              key={`${usuario.id}-${usuario.perfil}`}
              usuario={usuario}
              esYo={usuario.correo === correoActual}
              onCambiarPerfil={onCambiarPerfil}
              onEliminar={onEliminar}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
