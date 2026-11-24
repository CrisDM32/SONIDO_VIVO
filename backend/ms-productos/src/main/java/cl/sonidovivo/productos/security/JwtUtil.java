package cl.sonidovivo.productos.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * A diferencia de ms-usuarios, aqui NO se generan tokens: este microservicio
 * solo los valida. Como comparte el mismo jwt.secret, puede confiar en un
 * token firmado por ms-usuarios sin tener que llamarlo por cada peticion.
 */
@Component
public class JwtUtil {

    private final SecretKey llave;

    public JwtUtil(@Value("${jwt.secret}") String secreto) {
        this.llave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
    }

    public Claims validarYObtenerClaims(String token) {
        return Jwts.parser()
                .verifyWith(llave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
