package cl.duoc.fullstack.productos.controller;

import cl.duoc.fullstack.productos.dto.LoginRequest;
import cl.duoc.fullstack.productos.dto.LoginResponse;
import cl.duoc.fullstack.productos.service.AutenticacionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
