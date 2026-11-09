package cl.sonidovivo.productos.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.sonidovivo.productos.dto.PaginaResponse;
import cl.sonidovivo.productos.dto.UsuarioAdminResponse;
import cl.sonidovivo.productos.exception.DatoDuplicadoException;
import cl.sonidovivo.productos.exception.DatoInvalidoException;
import cl.sonidovivo.productos.exception.RecursoNoEncontradoException;
import cl.sonidovivo.productos.exception.ReglaNegocioException;
import cl.sonidovivo.productos.model.Perfiles;
import cl.sonidovivo.productos.model.Usuario;
import cl.sonidovivo.productos.repository.UsuarioRepository;
import cl.sonidovivo.productos.util.Rut;

/** Alta, búsqueda y baja de usuarios. Compartido por el registro de clientes y el panel de administración. */
@Service
public class UsuarioService {

	private static final int TAMANO_MAXIMO = 100;

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;

	public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}

	/** Crea un usuario garantizando RUT válido y RUT/correo únicos (RUT sin formato, correo en minúsculas). */
	@Transactional
	public Usuario crear(String nombre, String correoIngresado, String rutIngresado, String telefono, String clave, String perfil) {
		String correo = correoIngresado.trim().toLowerCase();
		String rut = Rut.normalizar(rutIngresado);

		if (!Rut.esValido(rut)) {
			throw new DatoInvalidoException("rut", "Ingresa un RUT válido (ej: 12.345.678-5)");
		}
		if (usuarioRepository.existsByRut(rut)) {
			throw new DatoDuplicadoException("rut", "Ya existe una cuenta con ese RUT");
		}
		if (usuarioRepository.existsByCorreo(correo)) {
			throw new DatoDuplicadoException("correo", "Ya existe una cuenta con ese correo");
		}

		Usuario usuario = new Usuario();
		usuario.setNombre(nombre.trim());
		usuario.setCorreo(correo);
		usuario.setRut(rut);
		usuario.setTelefono(telefono == null || telefono.isBlank() ? null : telefono.trim());
		usuario.setClave(passwordEncoder.encode(clave));
		usuario.setPerfil(perfil);

		try {
			return usuarioRepository.saveAndFlush(usuario);
		} catch (DataIntegrityViolationException ex) {
			// Alta simultánea: la restricción única de la BD es la última defensa.
			if (usuarioRepository.existsByRut(rut)) {
				throw new DatoDuplicadoException("rut", "Ya existe una cuenta con ese RUT");
			}
			throw new DatoDuplicadoException("correo", "Ya existe una cuenta con ese correo");
		}
	}

	@Transactional(readOnly = true)
	public PaginaResponse<UsuarioAdminResponse> buscar(String q, int pagina, int tamano) {
		String texto = q == null ? "" : q.trim();
		String rut = Rut.normalizar(texto);
		int tamanoSeguro = Math.min(Math.max(tamano, 1), TAMANO_MAXIMO);

		Page<Usuario> resultado = usuarioRepository
				.findByNombreContainingIgnoreCaseOrCorreoContainingIgnoreCaseOrRutContainingIgnoreCase(
						texto, texto, rut.isEmpty() ? texto : rut,
						PageRequest.of(Math.max(pagina, 0), tamanoSeguro, Sort.by("id")));

		return new PaginaResponse<>(
				resultado.getContent().stream().map(UsuarioAdminResponse::de).toList(),
				resultado.getNumber(), resultado.getTotalPages(), resultado.getTotalElements());
	}

	@Transactional
	public UsuarioAdminResponse cambiarPerfil(Long id, String perfil, String correoActual) {
		Usuario usuario = buscar(id);
		if (usuario.getCorreo().equals(correoActual)) {
			throw new ReglaNegocioException("No puedes cambiar tu propio perfil");
		}
		if (!usuario.getPerfil().equals(perfil)) {
			exigirOtroAdministrador(usuario, "No se puede quitar el perfil al último administrador");
		}

		usuario.setPerfil(perfil);
		return UsuarioAdminResponse.de(usuarioRepository.save(usuario));
	}

	@Transactional
	public void eliminar(Long id, String correoActual) {
		Usuario usuario = buscar(id);
		if (usuario.getCorreo().equals(correoActual)) {
			throw new ReglaNegocioException("No puedes eliminar tu propia cuenta");
		}
		exigirOtroAdministrador(usuario, "No se puede eliminar al último administrador");

		usuarioRepository.delete(usuario);
	}

	private Usuario buscar(Long id) {
		return usuarioRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
	}

	private void exigirOtroAdministrador(Usuario usuario, String mensaje) {
		if (Perfiles.ADMINISTRADOR.equals(usuario.getPerfil())
				&& usuarioRepository.countByPerfil(Perfiles.ADMINISTRADOR) <= 1) {
			throw new ReglaNegocioException(mensaje);
		}
	}

}
