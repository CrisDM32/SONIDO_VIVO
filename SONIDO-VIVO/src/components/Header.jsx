import Logo from '../images/logo.png'

export const Header = () => {
  return (
        <header class="header">
        <div class="main-header">
            <div class="logo-section">
                <a href="index.html" target="_self">
                    <img src={Logo} alt="Logo" class="logo"></img>
                </a>
            </div>

            <section class="nav-section">
                <nav class="nav">
                    <a href="index.html" class="item-nav">Home</a>
                    <div class="productos">
                        <a href="productos.html" class="item-nav">Productos</a>
                        <div class="menu-productos">
                            <a href=" producto-filtrado.html" class="item-menu-drop">Instrumentos</a>
                            <a href=" producto-filtrado.html" class="item-menu-drop">Accesorios</a>
                            <a href=" producto-filtrado.html" class="item-menu-drop">Estudio de Grabación</a>
                        </div>
                    </div>

                    <a href="contacto.html" class="item-nav">Contacto</a>
                </nav>
            </section>

            <section class="user-section">
                <div class="acceder">
                    <a href="acceder.html" class="user-link">
                        <span class="material-symbols-outlined icono-cuenta">
                            account_circle
                        </span>
                    </a>    
                    <div class="menu-acceder">
                        <a href="iniciar-sesion.html" class="item-menu-drop">
                            Iniciar Sesión
                        </a>
                        <a href="registro.html" class="item-menu-drop">
                            Regristrate
                        </a>
                    </div>
                    <a href="carrito.html" class="cart-link">
                    <span class="material-symbols-outlined icono-carrito">
                        shopping_cart
                    </span>
                    </a>
                </div> 
            </section>
        </div>
    </header>
  )
}