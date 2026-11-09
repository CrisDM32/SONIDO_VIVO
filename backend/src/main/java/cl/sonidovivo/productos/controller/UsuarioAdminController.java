package cl.sonidovivo.productos.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import cl.sonidovivo.productos.dto.PaginaResponse;
import cl.sonidovivo.productos.dto.PerfilRequest;
import cl.sonidovivo.productos.dto.UsuarioAdminResponse;
import cl.sonidovivo.productos.dto.UsuarioPersonalRequest;
import cl.sonidovivo.productos.service.UsuarioService;
import jakarta.validation.Valid;

/** Gestión de usuarios: solo administrador (se restringe en SeguridadConfig). */
@RestController
@RequestMapping("/api/v1/admin/usuarios")
public class UsuarioAdminController {

	private final UsuarioService usuarioService;

	public UsuarioAdminController(UsuarioService usuarioService) {
		this.usuarioService = usuarioService;
	}

	@GetMapping
	public PaginaResponse<UsuarioAdminResponse> buscar(
			@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		return usuarioService.buscar(q, page, size);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public UsuarioAdminResponse crear(@Valid @RequestBody UsuarioPersonalRequest request) {
		return UsuarioAdminResponse.de(usuarioService.crear(
				request.nombre(), request.correo(), request.rut(), request.telefono(), request.clave(), request.perfil()));
	}

	@PatchMapping("/{id}/perfil")
	public UsuarioAdminResponse cambiarPerfil(
			@PathVariable Long id, @Valid @RequestBody PerfilRequest request, Authentication autenticacion) {
		return usuarioService.cambiarPerfil(id, request.perfil(), autenticacion.getName());
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void eliminar(@PathVariable Long id, Authentication autenticacion) {
		usuarioService.eliminar(id, autenticacion.getName());
	}

}
