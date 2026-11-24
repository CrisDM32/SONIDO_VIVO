import { createContext, useContext, useState } from "react";
import { iniciarSesion as iniciarSesionApi, registrar as registrarApi } from "../api/auth";

/* ==========================================================================
   Gestion de sesion del frontend (IE3.3.2 de la pauta de EP3).

   Guarda el token JWT y los datos del usuario en localStorage, ademas de
   en el estado de React. La parte clave para que la sesion sobreviva a
   una recarga de pagina (F5) es el estado inicial perezoso de useState:
   la funcion que le pasamos solo corre UNA vez, al montar la app, y lee
   lo que haya quedado guardado de una sesion anterior.
   ========================================================================== */

const TOKEN_KEY = "sv_token";
const USUARIO_KEY = "sv_usuario";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem(USUARIO_KEY);
    return guardado ? JSON.parse(guardado) : null;
  });

  function guardarSesion(nuevoToken, nuevoUsuario) {
    localStorage.setItem(TOKEN_KEY, nuevoToken);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(nuevoUsuario));
    setToken(nuevoToken);
    setUsuario(nuevoUsuario);
  }

  async function iniciarSesion(credenciales) {
    const respuesta = await iniciarSesionApi(credenciales);
    guardarSesion(respuesta.token, respuesta.usuario);
    return respuesta.usuario;
  }

  // El registro NO inicia sesion automaticamente: el usuario debe loguearse
  // despues, igual que en cualquier tienda real.
  function registrar(datos) {
    return registrarApi(datos);
  }

  function cerrarSesion() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    setToken(null);
    setUsuario(null);
  }

  const value = {
    usuario,
    estaAutenticado: Boolean(token),
    iniciarSesion,
    registrar,
    cerrarSesion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook de conveniencia: en vez de importar useContext + AuthContext en cada
// componente, alcanza con `const { usuario } = useAuth();`
export function useAuth() {
  return useContext(AuthContext);
}
