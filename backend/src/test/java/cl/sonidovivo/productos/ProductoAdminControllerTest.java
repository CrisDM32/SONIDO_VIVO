package cl.sonidovivo.productos;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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

import cl.sonidovivo.productos.model.Perfiles;
import cl.sonidovivo.productos.model.Usuario;
import cl.sonidovivo.productos.repository.ProductoRepository;
import cl.sonidovivo.productos.repository.UsuarioRepository;
import cl.sonidovivo.productos.service.JwtServicio;

@SpringBootTest
class ProductoAdminControllerTest {

	private static final String RUTA = "/api/v1/admin/productos";

	@Autowired
	private WebApplicationContext contexto;
	@Autowired
	private UsuarioRepository usuarioRepository;
	@Autowired
	private ProductoRepository productoRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtServicio jwtServicio;

	private MockMvc mockMvc;
	private final List<Long> usuariosCreados = new ArrayList<>();
	private final List<Long> productosCreados = new ArrayList<>();

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.webAppContextSetup(contexto).apply(springSecurity()).build();
	}

	@AfterEach
	void limpiar() {
		productoRepository.deleteAllById(productosCreados);
		usuarioRepository.deleteAllById(usuariosCreados);
	}

	private String tokenDe(String perfil) {
		Usuario usuario = new Usuario();
		usuario.setNombre("Persona " + perfil);
		usuario.setCorreo(UUID.randomUUID() + "@test.cl");
		usuario.setClave(passwordEncoder.encode("clave1234"));
		usuario.setPerfil(perfil);
		usuariosCreados.add(usuarioRepository.save(usuario).getId());
		return "Bearer " + jwtServicio.generar(usuario);
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

	private String producto(String nombre, String categoria, int precio, int stock) {
		return productoConCodigo("T" + UUID.randomUUID().toString().substring(0, 10), nombre, categoria, precio, stock);
	}

	private String productoConCodigo(String codigo, String nombre, String categoria, int precio, int stock) {
		return "{\"codigo\":\"" + codigo + "\",\"nombre\":\"" + nombre + "\",\"categoria\":\"" + categoria
				+ "\",\"marca\":\"Marca\",\"modelo\":\"M1\",\"descripcion\":\"Descripción de prueba\",\"precio\":" + precio
				+ ",\"stock\":" + stock + ",\"icono\":\"🎸\"}";
	}

	private long crear(String token, String nombre, int stock) throws Exception {
		String json = enviar(post(RUTA), token, producto(nombre, "Accesorios", 5000, stock))
				.andExpect(status().isCreated())
				.andReturn().getResponse().getContentAsString();
		long id = Long.parseLong(json.replaceAll(".*\"id\":(\\d+).*", "$1"));
		productosCreados.add(id);
		return id;
	}

	@Test
	void sinTokenDevuelve401() throws Exception {
		enviar(get(RUTA), null, null).andExpect(status().isUnauthorized());
	}

	@Test
	void unClienteNoPuedeGestionarProductos() throws Exception {
		enviar(get(RUTA), tokenDe(Perfiles.CLIENTE), null)
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.mensaje").value("No tienes permisos para esta acción"));
	}

	@Test
	void administradorYVendedorPuedenListarConStockYEstado() throws Exception {
		for (String perfil : List.of(Perfiles.ADMINISTRADOR, Perfiles.VENDEDOR)) {
			enviar(get(RUTA), tokenDe(perfil), null)
					.andExpect(status().isOk())
					.andExpect(jsonPath("$[0].stock").exists())
					.andExpect(jsonPath("$[0].activo").exists());
		}
	}

	@Test
	void elVendedorCreaYEditaProductos() throws Exception {
		String token = tokenDe(Perfiles.VENDEDOR);
		long id = crear(token, "Cuerdas Elixir " + UUID.randomUUID(), 4);

		enviar(put(RUTA + "/" + id), token, producto("Cuerdas Elixir Premium " + id, "Accesorios", 9990, 7))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.precio").value(9990))
				.andExpect(jsonPath("$.stock").value(7));
	}

	@Test
	void datosInvalidosDevuelven400ConErroresPorCampo() throws Exception {
		enviar(post(RUTA), tokenDe(Perfiles.ADMINISTRADOR), productoConCodigo("x", "ab", "Otra", 0, -1))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errores.codigo").exists())
				.andExpect(jsonPath("$.errores.nombre").exists())
				.andExpect(jsonPath("$.errores.categoria").exists())
				.andExpect(jsonPath("$.errores.precio").exists())
				.andExpect(jsonPath("$.errores.stock").exists());
	}

	@Test
	void unNombreRepetidoDevuelve409AunqueCambienLasMayusculas() throws Exception {
		String token = tokenDe(Perfiles.ADMINISTRADOR);
		String nombre = "Pua Unica " + UUID.randomUUID();
		crear(token, nombre, 1);

		enviar(post(RUTA), token, producto(nombre.toUpperCase(), "Accesorios", 1000, 1))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.campo").value("nombre"));
	}

	@Test
	void unCodigoRepetidoDevuelve409AunqueCambienLasMayusculasYTambienAlEditar() throws Exception {
		String token = tokenDe(Perfiles.ADMINISTRADOR);
		long otro = crear(token, "Otro producto " + UUID.randomUUID(), 1);

		// El código GA001 pertenece a un producto del catálogo.
		enviar(post(RUTA), token, productoConCodigo("ga001", "Nombre nuevo " + UUID.randomUUID(), "Accesorios", 1000, 1))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.campo").value("codigo"));
		enviar(put(RUTA + "/" + otro), token, productoConCodigo("GA001", "Otro editado " + UUID.randomUUID(), "Accesorios", 1000, 1))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.campo").value("codigo"));
	}

	@Test
	void editarUnProductoInexistenteDevuelve404() throws Exception {
		enviar(put(RUTA + "/999999"), tokenDe(Perfiles.ADMINISTRADOR), producto("Nombre valido", "Accesorios", 1000, 1))
				.andExpect(status().isNotFound());
	}

	@Test
	void elStockSeFijaOSeAjustaPorDiferenciaPeroNuncaQuedaNegativo() throws Exception {
		String token = tokenDe(Perfiles.VENDEDOR);
		long id = crear(token, "Stock " + UUID.randomUUID(), 5);

		enviar(patch(RUTA + "/" + id + "/stock"), token, "{\"stock\":20}")
				.andExpect(status().isOk()).andExpect(jsonPath("$.stock").value(20));
		enviar(patch(RUTA + "/" + id + "/stock"), token, "{\"delta\":-5}")
				.andExpect(status().isOk()).andExpect(jsonPath("$.stock").value(15));
		enviar(patch(RUTA + "/" + id + "/stock"), token, "{\"delta\":-16}")
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.campo").value("stock"));
		enviar(patch(RUTA + "/" + id + "/stock"), token, "{}")
				.andExpect(status().isBadRequest());
		enviar(patch(RUTA + "/" + id + "/stock"), token, "{\"stock\":1,\"delta\":1}")
				.andExpect(status().isBadRequest());
	}

	@Test
	void sinStockElProductoSigueListadoPeroNoDisponible() throws Exception {
		String token = tokenDe(Perfiles.ADMINISTRADOR);
		String nombre = "Agotable " + UUID.randomUUID();
		long id = crear(token, nombre, 3);

		enviar(patch(RUTA + "/" + id + "/stock"), token, "{\"stock\":0}")
				.andExpect(jsonPath("$.disponible").value(false))
				.andExpect(jsonPath("$.activo").value(true));

		mockMvc.perform(get("/api/v1/productos"))
				.andExpect(jsonPath("$[?(@.nombre=='" + nombre + "')].disponible").value(false));
	}

	@Test
	void desactivarOcultaElProductoDelCatalogoPublicoYReactivarLoDevuelve() throws Exception {
		String token = tokenDe(Perfiles.ADMINISTRADOR);
		String nombre = "Temporal " + UUID.randomUUID();
		long id = crear(token, nombre, 3);

		enviar(patch(RUTA + "/" + id + "/activo"), token, "{\"activo\":false}")
				.andExpect(status().isOk()).andExpect(jsonPath("$.activo").value(false));

		mockMvc.perform(get("/api/v1/productos"))
				.andExpect(jsonPath("$[?(@.nombre=='" + nombre + "')]").isEmpty());
		enviar(get(RUTA + "?q=" + nombre.substring(0, 12)), token, null)
				.andExpect(jsonPath("$[?(@.id==" + id + ")].activo").value(false));

		enviar(patch(RUTA + "/" + id + "/activo"), token, "{\"activo\":true}").andExpect(status().isOk());
		mockMvc.perform(get("/api/v1/productos"))
				.andExpect(jsonPath("$[?(@.nombre=='" + nombre + "')]").isNotEmpty());
	}

	@Test
	void elListadoFiltraPorTextoYCategoria() throws Exception {
		String token = tokenDe(Perfiles.ADMINISTRADOR);
		enviar(get(RUTA + "?q=pop filter"), token, null)
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].codigo").value("ES005"));
		enviar(get(RUTA + "?categoria=Baterías"), token, null)
				.andExpect(jsonPath("$.length()").value(5));
		enviar(get(RUTA + "?categoria=Estudio y Grabación&q=auriculares"), token, null)
				.andExpect(jsonPath("$.length()").value(2));
	}

	// ---------- Destacados ----------

	private String conDestacado(String json, boolean destacado) {
		return json.substring(0, json.length() - 1) + ",\"destacado\":" + destacado + "}";
	}

	@Test
	void unProductoNuevoNoEsDestacadoAMenosQueSeIndique() throws Exception {
		String token = tokenDe(Perfiles.ADMINISTRADOR);

		long normal = crear(token, "Normal " + UUID.randomUUID(), 1);
		enviar(get(RUTA + "?q=Normal"), token, null)
				.andExpect(jsonPath("$[?(@.id==" + normal + ")].destacado").value(false));

		String json = enviar(post(RUTA), token, conDestacado(producto("Estrella " + UUID.randomUUID(), "Accesorios", 5000, 2), true))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.destacado").value(true))
				.andReturn().getResponse().getContentAsString();
		productosCreados.add(Long.parseLong(json.replaceAll(".*\"id\":(\\d+).*", "$1")));
	}

	@Test
	void administradorYVendedorPuedenMarcarYDesmarcarUnDestacado() throws Exception {
		long id = crear(tokenDe(Perfiles.ADMINISTRADOR), "Marcable " + UUID.randomUUID(), 3);

		for (String perfil : List.of(Perfiles.ADMINISTRADOR, Perfiles.VENDEDOR)) {
			String token = tokenDe(perfil);
			enviar(patch(RUTA + "/" + id + "/destacado"), token, "{\"destacado\":true}")
					.andExpect(status().isOk()).andExpect(jsonPath("$.destacado").value(true));
			mockMvc.perform(get("/api/v1/productos"))
					.andExpect(jsonPath("$[?(@.id==" + id + ")].destacado").value(true));
			enviar(patch(RUTA + "/" + id + "/destacado"), token, "{\"destacado\":false}")
					.andExpect(status().isOk()).andExpect(jsonPath("$.destacado").value(false));
		}
	}

	@Test
	void marcarDestacadoExigePermisosYUnCuerpoValido() throws Exception {
		long id = crear(tokenDe(Perfiles.ADMINISTRADOR), "Permisos " + UUID.randomUUID(), 3);
		String admin = tokenDe(Perfiles.ADMINISTRADOR);

		enviar(patch(RUTA + "/" + id + "/destacado"), null, "{\"destacado\":true}").andExpect(status().isUnauthorized());
		enviar(patch(RUTA + "/" + id + "/destacado"), tokenDe(Perfiles.CLIENTE), "{\"destacado\":true}")
				.andExpect(status().isForbidden());
		enviar(patch(RUTA + "/" + id + "/destacado"), admin, "{}").andExpect(status().isBadRequest());
		enviar(patch(RUTA + "/999999/destacado"), admin, "{\"destacado\":true}").andExpect(status().isNotFound());
	}

	@Test
	void editarUnProductoSinIndicarDestacadoConservaSuValor() throws Exception {
		String token = tokenDe(Perfiles.ADMINISTRADOR);
		long id = crear(token, "Conserva " + UUID.randomUUID(), 3);
		enviar(patch(RUTA + "/" + id + "/destacado"), token, "{\"destacado\":true}").andExpect(status().isOk());

		enviar(put(RUTA + "/" + id), token, producto("Conserva editado " + id, "Accesorios", 7000, 3))
				.andExpect(status().isOk()).andExpect(jsonPath("$.destacado").value(true));
		enviar(put(RUTA + "/" + id), token, conDestacado(producto("Conserva editado " + id, "Accesorios", 7000, 3), false))
				.andExpect(status().isOk()).andExpect(jsonPath("$.destacado").value(false));
	}

	@Test
	void desactivarUnDestacadoLoSacaDelCatalogoPublico() throws Exception {
		String token = tokenDe(Perfiles.ADMINISTRADOR);
		long id = crear(token, "Destacado temporal " + UUID.randomUUID(), 3);
		enviar(patch(RUTA + "/" + id + "/destacado"), token, "{\"destacado\":true}").andExpect(status().isOk());

		enviar(patch(RUTA + "/" + id + "/activo"), token, "{\"activo\":false}").andExpect(status().isOk());

		mockMvc.perform(get("/api/v1/productos"))
				.andExpect(jsonPath("$[?(@.id==" + id + ")]").isEmpty());
	}

}
