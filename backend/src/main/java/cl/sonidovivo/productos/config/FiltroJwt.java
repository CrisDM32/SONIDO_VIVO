package cl.sonidovivo.productos.config;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import cl.sonidovivo.productos.repository.UsuarioRepository;
import cl.sonidovivo.productos.service.JwtServicio;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class FiltroJwt extends OncePerRequestFilter {

	private final JwtServicio jwtServicio;
	private final UsuarioRepository usuarioRepository;

	public FiltroJwt(JwtServicio jwtServicio, UsuarioRepository usuarioRepository) {
		this.jwtServicio = jwtServicio;
		this.usuarioRepository = usuarioRepository;
	}

	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {
		String encabezado = request.getHeader(HttpHeaders.AUTHORIZATION);

		if (encabezado != null && encabezado.startsWith("Bearer ")) {
			String token = encabezado.substring(7);
			try {
				Claims claims = jwtServicio.leer(token);
				String correo = claims.get("correo", String.class);
				if (correo != null) {
					// El perfil se lee de la BD (no del token): si el usuario fue eliminado o cambió de perfil,
					// el cambio rige de inmediato y no cuando venza el token.
					usuarioRepository.findByCorreo(correo).ifPresent(usuario -> {
						UsernamePasswordAuthenticationToken autenticacion = new UsernamePasswordAuthenticationToken(
								usuario.getCorreo(),
								null,
								List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil().toUpperCase())));
						SecurityContextHolder.getContext().setAuthentication(autenticacion);
					});
				}
			} catch (JwtException | IllegalArgumentException ex) {
				SecurityContextHolder.clearContext();
			}
		}

		filterChain.doFilter(request, response);
	}

}
