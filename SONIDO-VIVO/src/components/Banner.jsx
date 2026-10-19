import BannerImage from '../images/banner.jpeg';

export const Banner = () => {
    return (
        <section class="banner-section">
            <img src={BannerImage} class="banner-image"></img>
            <div class="content">
            <a href="productos.html" class="boton-productos">Ver Productos</a>
            </div>


        </section>

    )
}
