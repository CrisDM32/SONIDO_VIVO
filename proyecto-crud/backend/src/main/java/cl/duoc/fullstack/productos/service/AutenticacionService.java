package cl.duoc.fullstack.productos.service;

import cl.duoc.fullstack.productos.dto.LoginRequest;
import cl.duoc.fullstack.productos.dto.LoginResponse;

public interface AutenticacionService {

    LoginResponse iniciarSesion(LoginRequest request);
}
