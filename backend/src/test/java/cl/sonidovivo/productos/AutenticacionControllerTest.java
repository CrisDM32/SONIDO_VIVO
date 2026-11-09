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
	private static final String REGISTRO = "/api/v1/auth/registro";
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

	private String registro(String nombre, String correo, String rut, String telefono, String clave) {
		return "{\"nombre\":\"" + nombre + "\",\"correo\":\"" + correo + "\",\"rut\":\"" + rut
				+ "\",\"telefono\":\"" + telefono + "\",\"clave\":\"" + clave + "\"}";
	}

	private org.springframework.test.web.servlet.ResultActions registrar(String json) throws Exception {
		return mockMvc.perform(post(REGISTRO).contentType(MediaType.APPLICATION_JSON).content(json));
	}

	@Test
	void registroCorrectoCreaLaCuentaYPermiteIniciarSesion() throws Exception {
		registrar(registro("Ana Pérez", "Ana.Registro@Correo.cl", "12.345.678-5", "+56 9 1234 5678", "clave1234"))
				.andExpect(status().isCreated());

		String json = mockMvc.perform(post(LOGIN).contentType(MediaType.APPLICATION_JSON)
				.content(cuerpo("ana.registro@correo.cl", "clave1234")))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
		Claims claims = jwtServicio.leer(json.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1"));

		assertEquals("cliente", claims.get("perfil", String.class));
		assertEquals("Ana Pérez", claims.get("nombre", String.class));
	}

	@Test
	void correoRepetidoDevuelve409AunqueCambienLasMayusculas() throws Exception {
		registrar(registro("Luis Soto", "luis@correo.cl", "11.111.111-1", "", "clave1234")).andExpect(status().isCreated());

		registrar(registro("Otro Luis", "LUIS@Correo.CL", "22.222.222-2", "", "clave1234"))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.campo").value("correo"));
	}

	@Test
	void rutRepetidoDevuelve409SinImportarElFormato() throws Exception {
		registrar(registro("Rosa Díaz", "rosa@correo.cl", "7.654.321-6", "", "clave1234")).andExpect(status().isCreated());

		registrar(registro("Otra Rosa", "rosa2@correo.cl", "7654321-6", "", "clave1234"))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.campo").value("rut"));
	}

	@Test
	void rutConDigitoVerificadorIncorrectoDevuelve400() throws Exception {
		registrar(registro("Pedro Gil", "pedro@correo.cl", "12.345.678-9", "", "clave1234"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.campo").value("rut"));
	}

	@Test
	void claveDebilYCorreoInvalidoDevuelven400ConErroresPorCampo() throws Exception {
		registrar(registro("Eva Mora", "no-es-correo", "12.345.678-5", "", "corta"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errores.correo").exists())
				.andExpect(jsonPath("$.errores.clave").exists());
	}

	@Test
	void elRegistroNoPuedeUsarElCorreoDelAdministrador() throws Exception {
		registrar(registro("Falso Admin", "admin@sonidovivo.cl", "9.999.999-3", "", "clave1234"))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.campo").value("correo"));
	}

	@Test
	void elCatalogoDeProductosSigueSiendoPublico() throws Exception {
		mockMvc.perform(get("/api/v1/productos"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(12));
	}

}
