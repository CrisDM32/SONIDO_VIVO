package cl.sonidovivo.productos;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import cl.sonidovivo.productos.service.JwtServicio;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@SpringBootTest
class AutenticacionControllerTest {

	private static final String LOGIN = "/api/v1/auth/login";
	private static final String RUTA_PROTEGIDA = "/api/v1/usuarios";

	@Autowired
	private WebApplicationContext contexto;

	@Autowired
	private JwtServicio jwtServicio;

	@Value("${app.jwt.secreto}")
	private String secreto;

	private MockMvc mockMvc;

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.webAppContextSetup(contexto).apply(springSecurity()).build();
	}

	private String cuerpo(String correo, String clave) {
		return "{\"correo\":\"" + correo + "\",\"clave\":\"" + clave + "\"}";
	}

	private String iniciarSesion() throws Exception {
		String json = mockMvc.perform(post(LOGIN).contentType(MediaType.APPLICATION_JSON)
				.content(cuerpo("admin@sonidovivo.cl", "admin-test")))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
		return json.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
	}

	private String tokenFirmadoCon(String claveTexto, long expiraEnMs) {
		SecretKey clave = Keys.hmacShaKeyFor(claveTexto.getBytes(StandardCharsets.UTF_8));
		return Jwts.builder()
				.claim("correo", "admin@sonidovivo.cl")
				.claim("perfil", "administrador")
				.expiration(new Date(System.currentTimeMillis() + expiraEnMs))
				.signWith(clave)
				.compact();
	}

	@Test
	void loginCorrectoDevuelveUnTokenConLosDatosDelUsuario() throws Exception {
		Claims claims = jwtServicio.leer(iniciarSesion());

		assertEquals("admin@sonidovivo.cl", claims.get("correo", String.class));
		assertEquals("administrador", claims.get("perfil", String.class));
		assertEquals("Administrador", claims.get("nombre", String.class));
	}

	@Test
	void claveIncorrectaDevuelve401() throws Exception {
		mockMvc.perform(post(LOGIN).contentType(MediaType.APPLICATION_JSON)
				.content(cuerpo("admin@sonidovivo.cl", "otra")))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.mensaje").value("Correo o clave incorrectos"));
	}

	@Test
	void correoInexistenteDevuelveElMismoError() throws Exception {
		mockMvc.perform(post(LOGIN).contentType(MediaType.APPLICATION_JSON)
				.content(cuerpo("nadie@sonidovivo.cl", "admin-test")))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.mensaje").value("Correo o clave incorrectos"));
	}

	@Test
	void camposFaltantesDevuelven401() throws Exception {
		mockMvc.perform(post(LOGIN).contentType(MediaType.APPLICATION_JSON).content("{}"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void cuerpoInvalidoDevuelve400() throws Exception {
		mockMvc.perform(post(LOGIN).contentType(MediaType.APPLICATION_JSON).content("esto no es json"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.mensaje").value("El cuerpo de la solicitud no es válido"));
	}

	@Test
	void rutaProtegidaSinTokenDevuelve401() throws Exception {
		mockMvc.perform(get(RUTA_PROTEGIDA))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.mensaje").value("No autorizado"));
	}

	@Test
	void conTokenValidoLaAutenticacionPasa() throws Exception {
		mockMvc.perform(get(RUTA_PROTEGIDA).header(HttpHeaders.AUTHORIZATION, "Bearer " + iniciarSesion()))
				.andExpect(status().isNotFound());
	}

	@Test
	void tokenManipuladoDevuelve401() throws Exception {
		mockMvc.perform(get(RUTA_PROTEGIDA).header(HttpHeaders.AUTHORIZATION, "Bearer " + iniciarSesion() + "x"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void tokenFirmadoConOtraClaveDevuelve401() throws Exception {
		String token = tokenFirmadoCon("otra-clave-distinta-de-mas-de-32-bytes-ok", 60000);

		mockMvc.perform(get(RUTA_PROTEGIDA).header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void tokenExpiradoDevuelve401() throws Exception {
		String token = tokenFirmadoCon(secreto, -1000);

		mockMvc.perform(get(RUTA_PROTEGIDA).header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void elCatalogoDeProductosSigueSiendoPublico() throws Exception {
		mockMvc.perform(get("/api/v1/productos"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(12));
	}

}
