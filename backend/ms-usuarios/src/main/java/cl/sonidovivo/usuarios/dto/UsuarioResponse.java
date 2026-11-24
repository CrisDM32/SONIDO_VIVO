package cl.sonidovivo.usuarios.dto;

import cl.sonidovivo.usuarios.model.Rol;
import cl.sonidovivo.usuarios.model.Usuario;

/** Lo que la API devuelve hacia afuera: nunca incluye el campo password. */
public class UsuarioResponse {

    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private Rol rol;
    private boolean activo;

    public static UsuarioResponse desde(Usuario usuario) {
        UsuarioResponse respuesta = new UsuarioResponse();
        respuesta.id = usuario.getId();
        respuesta.nombre = usuario.getNombre();
        respuesta.email = usuario.getEmail();
        respuesta.telefono = usuario.getTelefono();
        respuesta.rol = usuario.getRol();
        respuesta.activo = usuario.isActivo();
        return respuesta;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefono() {
        return telefono;
    }

    public Rol getRol() {
        return rol;
    }

    public boolean isActivo() {
        return activo;
    }
}
