package cl.sonidovivo.usuarios.model;

/**
 * Los 3 roles minimos que exige el documento de contexto (seccion 0.2).
 * No se elimina ninguno aunque el negocio todavia no use Vendedor/Administrador
 * desde el frontend: el backend ya queda preparado para los tres.
 */
public enum Rol {
    ADMINISTRADOR,
    VENDEDOR,
    CLIENTE
}
