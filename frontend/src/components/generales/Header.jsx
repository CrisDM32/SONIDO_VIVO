import Logo from '../../images/logo.png'

export const Header = () => {
  return (
        <header className="header">
        <div className="main-header">
            <div className="logo-section">
                <a href="index.html" target="_self">
                    <img src={Logo} alt="Logo" className="logo" />
                </a>
            </div>

            <section className="nav-section">
                <nav className="nav">
                    <a href="index.html" className="item-nav">Home</a>
                    <div className="productos">
                        <a href="productos.html" className="item-nav">Productos</a>
                        <div className="menu-productos">
                            <a href=" producto-filtrado.html" className="item-menu-drop">Instrumentos</a>
                            <a href=" producto-filtrado.html" className="item-menu-drop">Accesorios</a>
                            <a href=" producto-filtrado.html" className="item-menu-drop">Estudio de Grabación</a>
                        </div>
                    </div>

                    <a href="contacto.html" className="item-nav">Contacto</a>
                </nav>
            </section>

            <section className="user-section">
                <div className="header-actions">
                    <div className="acceder">
                        <a href="iniciar-sesion.html" className="user-link" aria-label="Cuenta">
                            <svg className="header-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3a3.25 3.25 0 1 1 0 6.5A3.25 3.25 0 0 1 12 5Zm0 14a7 7 0 0 1-5.6-2.8 5.8 5.8 0 0 1 11.2 0A7 7 0 0 1 12 19Z" />
                            </svg>
                        </a>
                        <div className="menu-acceder">
                            <a href="iniciar-sesion.html" className="item-menu-drop">
                                Iniciar Sesión
                            </a>
                            <a href="/registro.html" className="item-menu-drop">
                                Regístrate
                            </a>
                        </div>
                    </div>
                    <a href="carrito.html" className="cart-link" aria-label="Carrito de compras">
                        <svg className="header-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 2a1 1 0 0 0 0 2h2l3.1 9.2A3 3 0 0 0 11 15h7a3 3 0 0 0 2.8-2l2.1-6.2A1.4 1.4 0 0 0 21.6 5H7.1l-.5-1.5A2 2 0 0 0 4.7 2H3Zm4.8 5h13.4l-1.8 5.4a1.5 1.5 0 0 1-1.4 1h-7a1.5 1.5 0 0 1-1.4-1L7.8 7Z" />
                        </svg>
                    </a>
                </div> 
            </section>
        </div>
    </header>
  )
}