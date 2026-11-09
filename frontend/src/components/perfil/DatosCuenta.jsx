import { tarjetaClara } from '../../styles/clases.js'

const dato = 'm-0 grid gap-1 rounded-lg bg-[#efeded] px-4 py-3.5'

export default function DatosCuenta({ usuario, onCerrarSesion }) {
  const inicial = usuario.nombre.trim().charAt(0).toUpperCase()

  return (
    <section className={`${tarjetaClara} p-7 text-ink mobile:px-4 mobile:py-5`} aria-labelledby="perfil-cuenta">
      <div className="mb-5 flex items-center gap-4">
        <span
          aria-hidden="true"
          className="grid size-16 shrink-0 place-items-center rounded-full bg-button text-[28px] font-bold text-paper"
        >
          {inicial}
        </span>
        <div>
          <h2 id="perfil-cuenta" className="m-0 text-[24px]">{usuario.nombre}</h2>
          <p className="m-0 text-[#555]">Mi cuenta</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 mobile:grid-cols-[1fr]">
        <p className={dato}><span className="text-[14px] text-[#555]">Nombre</span><strong>{usuario.nombre}</strong></p>
        <p className={dato}><span className="text-[14px] text-[#555]">Correo electrónico</span><strong>{usuario.correo}</strong></p>
        <p className={dato}><span className="text-[14px] text-[#555]">Tipo de cuenta</span><strong className="capitalize">{usuario.perfil}</strong></p>
      </div>

      <button
        type="button"
        onClick={onCerrarSesion}
        className="mt-5 cursor-pointer rounded-sv border-2 border-button bg-transparent px-5 py-2.5 font-semibold text-button hover:bg-button hover:text-paper"
      >
        Cerrar sesión
      </button>
    </section>
  )
}
