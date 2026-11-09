package cl.sonidovivo.productos.dto;

import cl.sonidovivo.productos.model.Usuario;

/** Datos de un usuario visibles para el administrador. Nunca incluye la clave. */
public record UsuarioAdminResponse(Long id, String nombre, String correo, String rut, String telefono, String perfil) {

	public static UsuarioAdminResponse de(Usuario u) {
		return new UsuarioAdminResponse(u.getId(), u.getNombre(), u.getCorreo(), u.getRut(), u.getTelefono(), u.getPerfil());
	}

}
