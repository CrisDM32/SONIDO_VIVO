package cl.sonidovivo.usuarios.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Se ejecuta en CADA peticion HTTP, antes de llegar a cualquier controller.
 * Busca el header "Authorization: Bearer <token>", lo valida y, si es
 * correcto, le dice a Spring Security "este usuario esta autenticado y
 * tiene este rol", para que las reglas de SecurityConfig puedan aplicarse.
 *
 * Si no hay token, o es invalido, simplemente no autentica a nadie: no
 * lanza error aqui (eso lo decide mas adelante SecurityConfig, segun si
 * la ruta pedida es publica o no).
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                Claims claims = jwtUtil.validarYObtenerClaims(token);
                String email = claims.getSubject();
                String rol = claims.get("rol", String.class);

                // Spring Security espera los roles con el prefijo "ROLE_" para
                // que funcionen anotaciones como hasRole("ADMINISTRADOR").
                List<GrantedAuthority> permisos =
                        List.of(new SimpleGrantedAuthority("ROLE_" + rol));

                var autenticacion =
                        new UsernamePasswordAuthenticationToken(email, null, permisos);

                SecurityContextHolder.getContext().setAuthentication(autenticacion);
            } catch (Exception excepcion) {
                // Token invencido, vencido o corrupto: no se autentica a nadie.
                // La peticion sigue, pero llegara a SecurityConfig como "anonima".
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
