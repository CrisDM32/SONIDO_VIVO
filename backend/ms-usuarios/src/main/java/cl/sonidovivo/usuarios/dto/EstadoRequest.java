package cl.sonidovivo.usuarios.dto;

/** Body que usa el panel de administracion para activar/desactivar un usuario. */
public class EstadoRequest {

    private boolean activo;

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}
