package cl.sonidovivo.productos;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import cl.sonidovivo.productos.exception.ReglaNegocioException;
import cl.sonidovivo.productos.model.Perfiles;
import cl.sonidovivo.productos.model.Usuario;
import cl.sonidovivo.productos.repository.UsuarioRepository;
import cl.sonidovivo.productos.service.JwtServicio;
import cl.sonidovivo.productos.service.UsuarioService;
import cl.sonidovivo.productos.util.Rut;

@SpringBootTest
class UsuarioAdminControllerTest {

	private static final String RUTA = "/api/v1/admin/usuarios";

	@Autowired
	private WebApplicationContext contexto;
	@Autowired
	private UsuarioRepository usuarioRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtServicio jwtServicio;
	@Autowired
	private UsuarioService usuarioService;

	private MockMvc mockMvc;
	private final List<Long> creados = new ArrayList<>();

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.webAppContextSetup(contexto).apply(springSecurity()).build();
	}

	@AfterEach
	void limpiar() {
		usuarioRepository.deleteAllById(creados);
	}

	private Usuario usuario(String perfil, String rut) {
		Usuario u = new Usuario();
		u.setNombre("Persona " + perfil);
		u.setCorreo(UUID.randomUUID() + "@test.cl");
		u.setRut(Rut.normalizar(rut));
		u.setTelefono("+56 9 1111 2222");
		u.setClave(passwordEncoder.encode("clave1234"));
		u.setPerfil(perfil);
		Usuario guardado = usuarioRepository.save(u);
		creados.add(guardado.getId());
		return guardado;
	}

	private String token(Usuario u) {
		return "Bearer " + jwtServicio.generar(u);
	}

	private ResultActions enviar(MockHttpServletRequestBuilder peticion, String token, String json) throws Exception {
		if (token != null) {
			peticion.header(HttpHeaders.AUTHORIZATION, token);
		}
		if (json != null) {
			peticion.contentType(MediaType.APPLICATION_JSON).content(json);
		}
		return mockMvc.perform(peticion);
	}

	private String personal(String correo, String rut, String perfil) {
		return "{\"nombre\":\"Vera Vendedora\",\"correo\":\"" + correo + "\",\"rut\":\"" + rut
				+ "\",\"telefono\":\"\",\"clave\":\"clave1234\",\"perfil\":\"" + perfil + "\"}";
	}

	@Test
	void soloElAdministradorPuedeGestionarUsuarios() throws Exception {
		enviar(get(RUTA), null, null).andExpect(status().isUnauthorized());
		enviar(get(RUTA), token(usuario(Perfiles.CLIENTE, "5.555.555-5")), null).andExpect(status().isForbidden());
		enviar(get(RUTA), token(usuario(Perfiles.VENDEDOR, "6.666.666-6")), null).andExpect(status().isForbidden());
		enviar(get(RUTA), token(usuario(Perfiles.ADMINISTRADOR, "7.777.777-7")), null).andExpect(status().isOk());
	}

	@Test
	void buscaPorNombreCorreoORutYNuncaDevuelveLaClave() throws Exception {
		String token = token(usuario(Perfiles.ADMINISTRADOR, "8.888.888-8"));
		Usuario buscado = usuario(Perfiles.CLIENTE, "9.999.999-3");

		for (String q : List.of(buscado.getCorreo().substring(0, 10), "9.999.999-3", "9999999")) {
			enviar(get(RUTA + "?q=" + q), token, null)
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.contenido[?(@.id==" + buscado.getId() + ")].rut").value("99999993"))
					.andExpect(jsonPath("$.contenido[?(@.id==" + buscado.getId() + ")].telefono").value("+56 9 1111 2222"));
		}

		String cuerpo = enviar(get(RUTA + "?size=100"), token, null).andReturn().getResponse().getContentAsString();
		assertEquals(false, cuerpo.contains("clave"), "la respuesta no debe incluir contraseñas");
		assertEquals(false, cuerpo.contains("$2a$"), "la respuesta no debe incluir hashes");
	}

	@Test
	void elAdministradorCreaUnVendedorQueLuegoPuedeIniciarSesion() throws Exception {
		String token = token(usuario(Perfiles.ADMINISTRADOR, "4.444.444-4"));
		String correo = UUID.randomUUID() + "@sonidovivo.cl";

		String json = enviar(post(RUTA), token, personal(correo, "18.000.000-3", "vendedor"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.perfil").value("vendedor"))
				.andReturn().getResponse().getContentAsString();
		creados.add(Long.parseLong(json.replaceAll(".*\"id\":(\\d+).*", "$1")));

		String login = mockMvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
				.content("{\"correo\":\"" + correo + "\",\"clave\":\"clave1234\"}"))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
		String tokenVendedor = login.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");

		mockMvc.perform(get("/api/v1/admin/productos").header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenVendedor))
				.andExpect(status().isOk());
		mockMvc.perform(get(RUTA).header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenVendedor))
				.andExpect(status().isForbidden());
	}

	@Test
	void crearPersonalRespetaLaUnicidadYElPerfilPermitido() throws Exception {
		String token = token(usuario(Perfiles.ADMINISTRADOR, "3.333.333-3"));
		Usuario existente = usuario(Perfiles.CLIENTE, "19.000.000-1");

		enviar(post(RUTA), token, personal("nuevo-" + UUID.randomUUID() + "@x.cl", "19.000.000-1", "vendedor"))
				.andExpect(status().isConflict()).andExpect(jsonPath("$.campo").value("rut"));
		enviar(post(RUTA), token, personal(existente.getCorreo().toUpperCase(), "21.000.000-3", "vendedor"))
				.andExpect(status().isConflict()).andExpect(jsonPath("$.campo").value("correo"));
		enviar(post(RUTA), token, personal("otro@x.cl", "21.000.000-3", "cliente"))
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.errores.perfil").exists());
	}

	@Test
	void cambiarPerfilYEliminarFuncionanSobreOtrosUsuarios() throws Exception {
		Usuario admin = usuario(Perfiles.ADMINISTRADOR, "2.222.222-2");
		Usuario otro = usuario(Perfiles.CLIENTE, "1.111.111-1");

		enviar(patch(RUTA + "/" + otro.getId() + "/perfil"), token(admin), "{\"perfil\":\"vendedor\"}")
				.andExpect(status().isOk()).andExpect(jsonPath("$.perfil").value("vendedor"));
		enviar(delete(RUTA + "/" + otro.getId()), token(admin), null).andExpect(status().isNoContent());
		enviar(delete(RUTA + "/" + otro.getId()), token(admin), null).andExpect(status().isNotFound());
	}

	@Test
	void elAdministradorNoPuedeEliminarNiDegradarSuPropiaCuenta() throws Exception {
		Usuario admin = usuario(Perfiles.ADMINISTRADOR, "10.000.000-1");
		usuario(Perfiles.ADMINISTRADOR, "10.000.001-K");

		enviar(delete(RUTA + "/" + admin.getId()), token(admin), null).andExpect(status().isConflict());
		enviar(patch(RUTA + "/" + admin.getId() + "/perfil"), token(admin), "{\"perfil\":\"cliente\"}")
				.andExpect(status().isConflict());
	}

	@Test
	void unUsuarioEliminadoPierdeElAccesoDeInmediatoAunqueSuTokenSigaVigente() throws Exception {
		Usuario admin = usuario(Perfiles.ADMINISTRADOR, "13.000.000-3");
		Usuario vendedor = usuario(Perfiles.VENDEDOR, "14.000.000-4");
		String tokenVendedor = token(vendedor);

		enviar(get("/api/v1/admin/productos"), tokenVendedor, null).andExpect(status().isOk());
		enviar(delete(RUTA + "/" + vendedor.getId()), token(admin), null).andExpect(status().isNoContent());

		enviar(get("/api/v1/admin/productos"), tokenVendedor, null).andExpect(status().isUnauthorized());
	}

	@Test
	void unCambioDePerfilRigeSinEsperarAQueVenzaElToken() throws Exception {
		Usuario admin = usuario(Perfiles.ADMINISTRADOR, "15.000.000-K");
		Usuario vendedor = usuario(Perfiles.VENDEDOR, "16.000.000-2");
		String tokenVendedor = token(vendedor);

		enviar(patch(RUTA + "/" + vendedor.getId() + "/perfil"), token(admin), "{\"perfil\":\"cliente\"}")
				.andExpect(status().isOk());

		enviar(get("/api/v1/admin/productos"), tokenVendedor, null).andExpect(status().isForbidden());
	}

	@Test
	void noSePuedeEliminarNiDegradarAlUltimoAdministrador() {
		// Cada test limpia sus usuarios: aquí el único administrador es el sembrado.
		Usuario sembrado = usuarioRepository.findByCorreo("admin@sonidovivo.cl").orElseThrow();

		assertThrows(ReglaNegocioException.class, () -> usuarioService.eliminar(sembrado.getId(), "otra@persona.cl"));
		assertThrows(ReglaNegocioException.class,
				() -> usuarioService.cambiarPerfil(sembrado.getId(), Perfiles.VENDEDOR, "otra@persona.cl"));
	}

}
