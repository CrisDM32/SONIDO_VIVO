package cl.sonidovivo.productos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.sonidovivo.productos.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	Optional<Usuario> findByCorreo(String correo);

}
