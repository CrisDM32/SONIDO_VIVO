import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import "./index.css";

/* ==========================================================================
   Punto de entrada de la app. Esto reemplaza a todos los <script> sueltos
   que cada página .html cargaba por separado (js/script.js, js/productos.js,
   js/carrito.js, etc.): ahora todo arranca desde un solo lugar.

   BrowserRouter habilita las URLs tipo /productos, /carrito, etc. dentro
   de esta única página (así es como React Router sabe qué mostrar).

   AuthProvider envuelve toda la app para que CUALQUIER componente (NavBar,
   ProtectedRoute, Login, Registro, etc.) pueda leer la sesión actual con
   el hook useAuth(), sin tener que pasarla a mano de componente en
   componente ("prop drilling").
   ========================================================================== */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
