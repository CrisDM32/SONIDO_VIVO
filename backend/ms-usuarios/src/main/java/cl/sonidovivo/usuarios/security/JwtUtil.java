package cl.sonidovivo.usuarios.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Crea y valida los tokens JWT. El mismo secreto (jwt.secret) debe estar
 * configurado en ms-productos para que ese microservicio pueda validar un
 * token emitido aqui sin tener que llamar de vuelta a ms-usuarios por cada
 * peticion (asi se evita acoplar los microservicios entre si).
 */
@Component
public class JwtUtil {

    private final SecretKey llave;
    private final long expiracionMs;

    public JwtUtil(@Value("${jwt.secret}") String secreto,
                    @Value("${jwt.expiration-ms}") long expiracionMs) {
        this.llave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.expiracionMs = expiracionMs;
    }

    public String generarToken(Long usuarioId, String email, String rol) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + expiracionMs);

        return Jwts.builder()
                .subject(email)
                .claim("id", usuarioId)
                .claim("rol", rol)
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(llave)
                .compact();
    }

    public Claims validarYObtenerClaims(String token) {
        return Jwts.parser()
                .verifyWith(llave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
