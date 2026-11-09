package cl.sonidovivo.productos.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import cl.sonidovivo.productos.model.Usuario;
import cl.sonidovivo.productos.repository.UsuarioRepository;

@Component
public class DatosIniciales implements CommandLineRunner {

	private static final String CORREO_ADMIN = "admin@sonidovivo.cl";

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;
	private final String claveAdmin;

	public DatosIniciales(
			UsuarioRepository usuarioRepository,
			PasswordEncoder passwordEncoder,
			@Value("${app.admin.clave}") String claveAdmin) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
		this.claveAdmin = claveAdmin;
	}

	@Override
	public void run(String... args) {
		if (usuarioRepository.findByCorreo(CORREO_ADMIN).isPresent()) {
			return;
		}

		Usuario usuario = new Usuario();
		usuario.setNombre("Administrador");
		usuario.setCorreo(CORREO_ADMIN);
		usuario.setClave(passwordEncoder.encode(claveAdmin));
		usuario.setPerfil("administrador");
		usuarioRepository.save(usuario);
	}

}
