package cl.sonidovivo.usuarios.dto;

import cl.sonidovivo.usuarios.model.Rol;
import jakarta.validation.constraints.NotNull;

/** Body que usa el panel de administracion para asignarle un rol nuevo a un usuario. */
public class RolRequest {

    @NotNull(message = "El rol es obligatorio")
    private Rol rol;

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
