package cl.sonidovivo.productos.service;

import cl.sonidovivo.productos.dto.LoginRequest;
import cl.sonidovivo.productos.dto.LoginResponse;
import cl.sonidovivo.productos.dto.RegistroRequest;
import cl.sonidovivo.productos.dto.RegistroResponse;

public interface AutenticacionService {

	LoginResponse iniciarSesion(LoginRequest request);

	RegistroResponse registrar(RegistroRequest request);

}
