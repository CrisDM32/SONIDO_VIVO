package cl.duoc.fullstack.productos.service;

import cl.duoc.fullstack.productos.dto.LoginRequest;
import cl.duoc.fullstack.productos.dto.LoginResponse;
import cl.duoc.fullstack.productos.exception.CredencialesInvalidasException;
import cl.duoc.fullstack.productos.model.Usuario;
import cl.duoc.fullstack.productos.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AutenticacionServiceImpl implements AutenticacionService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtServicio jwtServicio;

    public AutenticacionServiceImpl(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtServicio jwtServicio) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtServicio = jwtServicio;
    }

    @Override
    public LoginResponse iniciarSesion(LoginRequest request) {
        if (request == null || request.correo() == null || request.clave() == null) {
            throw new CredencialesInvalidasException();
        }

        Usuario usuario = usuarioRepository.findByCorreo(request.correo().trim())
                .orElseThrow(CredencialesInvalidasException::new);

        if (!passwordEncoder.matches(request.clave(), usuario.getClave())) {
            throw new CredencialesInvalidasException();
        }

        return new LoginResponse(jwtServicio.generar(usuario));
    }
}
