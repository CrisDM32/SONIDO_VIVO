import { Link } from 'react-router-dom'
import instagramLogo from '../../images/icono/instagram-logo.svg';
import facebookLogo from '../../images/icono/facebook-logo.svg';
import emailLogo from '../../images/icono/correo-logo.svg';

const columna = 'flex min-w-0 flex-col p-2.5 [overflow-wrap:anywhere] mobile:p-1'
const titulo = 'mobile:m-0 mobile:mb-2 mobile:text-[16px]'
const enlace =
  'w-fit max-w-full p-2.5 text-inherit no-underline hover:rounded-sv hover:bg-[rgb(122,122,122)] mobile:px-1 mobile:py-2 mobile:text-[14px]'
const enlaceRed = 'w-fit max-w-full'
const iconoRed = 'size-[35px]'

export const Footer = () => {
  return (
    <footer className="grid w-full grid-cols-4 gap-6 bg-bottom px-[5%] pt-[50px] pb-5 mobile:grid-cols-2 mobile:gap-x-3 mobile:gap-y-4 mobile:px-4 mobile:pt-7 mobile:pb-5 mini:grid-cols-1">
        <div className={columna}>
            <h3 className={titulo}>Servicio al Cliente</h3>
            <a href="preguntas-frecuentes.html" className={enlace}>Preguntas Frecuentes</a>
            <a href="preguntas-frecuentes.html" className={enlace}>Preguntas Frecuentes</a>
            <a href="preguntas-frecuentes.html" className={enlace}>Preguntas Frecuentes</a>
        </div>
        <div className={columna}>
            <h3 className={titulo}>Terminos y Condiciones</h3>
            <a href="terminos-y-condiciones.hmtl" className={enlace}>Terminos y Condiciones</a>
            <a href="terminos-y-condiciones.hmtl" className={enlace}>Terminos y Condiciones</a>
            <a href="terminos-y-condiciones.hmtl" className={enlace}>Terminos y Condiciones</a>
        </div>
        <div className={columna}>
            <h3 className={titulo}>Mi Cuenta</h3>
            <Link to="/iniciar-sesion" className={enlace}>Iniciar Sesión</Link>
            <Link to="/registro" className={enlace}>Registrate</Link>
        </div>
        <div className={columna}>
            <h3 className={titulo}>Contactanos</h3>
            <a href="https://www.instagram.com/" target="_blank" className={enlaceRed}>
                <img src={instagramLogo} alt="Instagram" className={iconoRed} />
            </a>
            <a href="https://www.facebook.com/" target="_blank" className={enlaceRed}>
                <img src={facebookLogo} alt="Facebook" className={iconoRed} />
            </a>
            <a href="mailto:contacto@sonidovivo.cl" target="_blank" className={enlaceRed}>
                <img src={emailLogo} alt="Correo" className={iconoRed} />
            </a>
        </div>
    </footer>
    )
}
