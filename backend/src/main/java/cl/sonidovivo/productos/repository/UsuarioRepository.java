package cl.sonidovivo.productos.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import cl.sonidovivo.productos.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	Optional<Usuario> findByCorreo(String correo);

	boolean existsByCorreo(String correo);

	boolean existsByRut(String rut);

	long countByPerfil(String perfil);

	Page<Usuario> findByNombreContainingIgnoreCaseOrCorreoContainingIgnoreCaseOrRutContainingIgnoreCase(
			String nombre, String correo, String rut, Pageable pageable);

}
