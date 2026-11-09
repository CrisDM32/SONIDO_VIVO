package cl.sonidovivo.productos.service;

import cl.sonidovivo.productos.dto.LoginRequest;
import cl.sonidovivo.productos.dto.LoginResponse;

public interface AutenticacionService {

	LoginResponse iniciarSesion(LoginRequest request);

}
