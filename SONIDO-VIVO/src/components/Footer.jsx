import instagramLogo from '../images/icono/instagram-logo.svg';
import facebookLogo from '../images/icono/facebook-logo.svg';
import emailLogo from '../images/icono/correo-logo.svg';

export const Footer = () => {
  return (
    <footer className="footer">
        <div className="item-container-footer">
            <h3>Servicio al Cliente</h3>
            <a href="preguntas-frecuentes.html" className="item-footer">Preguntas Frecuentes</a>
            <a href="preguntas-frecuentes.html" className="item-footer">Preguntas Frecuentes</a>
            <a href="preguntas-frecuentes.html" className="item-footer">Preguntas Frecuentes</a>
        </div>
        <div className="item-container-footer">
            <h3>Terminos y Condiciones</h3>
            <a href="terminos-y-condiciones.hmtl" className="item-footer">Terminos y Condiciones</a>
            <a href="terminos-y-condiciones.hmtl" className="item-footer">Terminos y Condiciones</a>
            <a href="terminos-y-condiciones.hmtl" className="item-footer">Terminos y Condiciones</a>
        </div>
        <div className="item-container-footer">
            <h3>Mi Cuenta</h3>
            <a href="iniciar-sesion" className="item-footer">Iniciar Sesión</a>
            <a href="registro.html" className="item-footer">Registrate</a>
        </div>
        <div className="item-container-footer">
            <h3>Contactanos</h3>
            <a href="https://www.instagram.com/" target="_blank">
                <img src={instagramLogo} alt="Instagram" />
            </a>
            <a href="https://www.facebook.com/" target="_blank">
                <img src={facebookLogo} alt="Facebook" />
            </a>
            <a href="mailto:contacto@sonidovivo.cl" target="_blank">
                <img src={emailLogo} alt="Correo" />
            </a>
        </div>
    </footer>
    )
}