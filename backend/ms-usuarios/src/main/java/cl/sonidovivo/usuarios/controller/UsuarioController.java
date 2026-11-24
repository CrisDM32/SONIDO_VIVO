package cl.sonidovivo.usuarios.controller;

import cl.sonidovivo.usuarios.dto.EstadoRequest;
import cl.sonidovivo.usuarios.dto.RolRequest;
import cl.sonidovivo.usuarios.dto.UsuarioResponse;
import cl.sonidovivo.usuarios.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CRUD de usuarios para el panel de administracion (seccion 0.1 del
 * documento). SecurityConfig ya exige rol ADMINISTRADOR para todo este
 * controller, excepto /me que esta reservado aparte para cualquier
 * usuario autenticado (ver SecurityConfig).
 */
@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Gestion de usuarios (solo Administrador)")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @Operation(summary = "Lista todos los usuarios del sistema")
    public List<UsuarioResponse> listar() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/me")
    @Operation(summary = "Devuelve el perfil del usuario autenticado actualmente")
    public UsuarioResponse perfilActual(Authentication authentication) {
        // JwtAuthFilter guarda el email del token como "nombre" del Authentication.
        return usuarioService.buscarPorEmail(authentication.getName());
    }

    @PutMapping("/{id}/rol")
    @Operation(summary = "Cambia el rol de un usuario (Cliente, Vendedor o Administrador)")
    public UsuarioResponse cambiarRol(@PathVariable Long id, @Valid @RequestBody RolRequest request) {
        return usuarioService.cambiarRol(id, request.getRol());
    }

    @PutMapping("/{id}/estado")
    @Operation(summary = "Activa o desactiva una cuenta de usuario")
    public UsuarioResponse cambiarEstado(@PathVariable Long id, @RequestBody EstadoRequest request) {
        return usuarioService.cambiarEstado(id, request.isActivo());
    }
}
