package cl.sonidovivo.productos.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import cl.sonidovivo.productos.dto.LoginRequest;
import cl.sonidovivo.productos.dto.LoginResponse;
import cl.sonidovivo.productos.dto.RegistroRequest;
import cl.sonidovivo.productos.dto.RegistroResponse;
import cl.sonidovivo.productos.exception.CredencialesInvalidasException;
import cl.sonidovivo.productos.model.Perfiles;
import cl.sonidovivo.productos.model.Usuario;
import cl.sonidovivo.productos.repository.UsuarioRepository;

@Service
public class AutenticacionServiceImpl implements AutenticacionService {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtServicio jwtServicio;
	private final UsuarioService usuarioService;

	public AutenticacionServiceImpl(
			UsuarioRepository usuarioRepository,
			PasswordEncoder passwordEncoder,
			JwtServicio jwtServicio,
			UsuarioService usuarioService) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtServicio = jwtServicio;
		this.usuarioService = usuarioService;
	}

	@Override
	public LoginResponse iniciarSesion(LoginRequest request) {
		if (request == null || request.correo() == null || request.clave() == null) {
			throw new CredencialesInvalidasException();
		}

		Usuario usuario = usuarioRepository.findByCorreo(request.correo().trim().toLowerCase())
				.orElseThrow(CredencialesInvalidasException::new);

		if (!passwordEncoder.matches(request.clave(), usuario.getClave())) {
			throw new CredencialesInvalidasException();
		}

		return new LoginResponse(jwtServicio.generar(usuario));
	}

	@Override
	public RegistroResponse registrar(RegistroRequest request) {
		usuarioService.crear(request.nombre(), request.correo(), request.rut(), request.telefono(), request.clave(),
				Perfiles.CLIENTE);
		return new RegistroResponse("Cuenta creada correctamente");
	}

}
