import { Link } from 'react-router-dom'
import Logo from '../../images/logo.png'

const enlaceMenu =
  'block rounded-sv px-5 py-3 text-[18px] text-paper no-underline hover:bg-page hover:text-ink mobile:px-4 mobile:text-[16px]'

const menuDesplegable =
  'absolute top-full z-[1000] hidden min-w-[200px] rounded-[10px] bg-header py-2.5 shadow-[0_8px_20px_rgb(0_0_0/25%)] group-hover:block group-focus-within:block mobile:min-w-[180px]'

const enlaceNav =
  'm-0 rounded-sv px-[1%] py-[3%] text-[24px] font-medium text-inherit no-underline hover:border-x-2 hover:border-t-2 hover:border-button tablet:text-[clamp(18px,2.6vw,22px)] mobile:px-1 mobile:py-1.5 mobile:text-[clamp(16px,4vw,20px)] mini:text-[15px]'

const enlaceIcono = 'block p-5 tablet:p-3 mobile:p-2 mini:p-1.5'
const icono = 'block size-10 fill-paper tablet:size-[34px] mobile:size-[30px] mini:size-[26px]'

export const Header = () => {
  return (
    <header className="bg-page">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-b-[10px] bg-header px-5 py-2.5 text-paper tablet:px-4 mobile:gap-x-3 mobile:gap-y-1.5 mobile:px-3 mobile:pt-2 mobile:pb-3">
        <div>
          <Link to="/">
            <img src={Logo} alt="Logo" className="h-20 tablet:h-16 mobile:h-[52px]" />
          </Link>
        </div>

        <section className="min-w-0 mobile:order-3 mobile:flex-[1_0_100%]">
          <nav className="flex items-center gap-[30px] tablet:gap-[clamp(12px,3vw,24px)] mobile:justify-center mobile:gap-[clamp(12px,5vw,28px)] mini:gap-2">
            <Link to="/" className={enlaceNav}>Home</Link>
            <div className="group relative">
              <Link to="/productos" className={enlaceNav}>Productos</Link>
              <div className={menuDesplegable}>
                <Link to="/productos/instrumentos" className={enlaceMenu}>Instrumentos</Link>
                <Link to="/productos/accesorios" className={enlaceMenu}>Accesorios</Link>
                <Link to="/productos/estudio-de-grabacion" className={enlaceMenu}>Estudio de Grabación</Link>
              </div>
            </div>

            <Link to="/contacto" className={enlaceNav}>Contacto</Link>
          </nav>
        </section>

        <section>
          <div className="flex items-center gap-3 mobile:gap-0.5">
            <div className="group relative">
              <Link to="/iniciar-sesion" className={enlaceIcono} aria-label="Cuenta">
                <svg className={icono} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3a3.25 3.25 0 1 1 0 6.5A3.25 3.25 0 0 1 12 5Zm0 14a7 7 0 0 1-5.6-2.8 5.8 5.8 0 0 1 11.2 0A7 7 0 0 1 12 19Z" />
                </svg>
              </Link>
              <div className={`${menuDesplegable} right-0`}>
                <Link to="/iniciar-sesion" className={enlaceMenu}>
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className={enlaceMenu}>
                  Regístrate
                </Link>
              </div>
            </div>
            <Link to="/carrito" className={enlaceIcono} aria-label="Carrito de compras">
              <svg className={icono} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 2a1 1 0 0 0 0 2h2l3.1 9.2A3 3 0 0 0 11 15h7a3 3 0 0 0 2.8-2l2.1-6.2A1.4 1.4 0 0 0 21.6 5H7.1l-.5-1.5A2 2 0 0 0 4.7 2H3Zm4.8 5h13.4l-1.8 5.4a1.5 1.5 0 0 1-1.4 1h-7a1.5 1.5 0 0 1-1.4-1L7.8 7Z" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </header>
  )
}
