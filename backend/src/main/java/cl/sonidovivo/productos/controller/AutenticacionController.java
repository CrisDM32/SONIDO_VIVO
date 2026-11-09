package cl.sonidovivo.productos.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.sonidovivo.productos.dto.LoginRequest;
import cl.sonidovivo.productos.dto.LoginResponse;
import cl.sonidovivo.productos.service.AutenticacionService;

@RestController
@RequestMapping("/api/v1/auth")
public class AutenticacionController {

	private final AutenticacionService autenticacionService;

	public AutenticacionController(AutenticacionService autenticacionService) {
		this.autenticacionService = autenticacionService;
	}

	@PostMapping("/login")
	public LoginResponse login(@RequestBody LoginRequest request) {
		return autenticacionService.iniciarSesion(request);
	}

}
