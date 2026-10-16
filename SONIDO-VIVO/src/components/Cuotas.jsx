import BanderaLogo from '../images/icono/bandera-logo.svg';

export const Cuotas = () => {
    return (
        <section class="envios-chile-section">
            <div class="envios-chile">
                <p><b>Envios a todo Chile</b></p>
                <img src={BanderaLogo} alt="Bandera Chilena"></img>
            </div>
            <div class="cuotas">
                <p><b>Paga en 12 cuotas sin Intéres!</b></p>
            </div>
        </section>
    )
}