package cl.sonidovivo.productos;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
class ProductoControllerTest {

	@Autowired
	private WebApplicationContext contexto;

	private MockMvc mockMvc;

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.webAppContextSetup(contexto).apply(springSecurity()).build();
	}

	@Test
	void listarDevuelveElCatalogoDelExcelSinExponerElStock() throws Exception {
		mockMvc.perform(get("/api/v1/productos"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(51))
				.andExpect(jsonPath("$[0].codigo").value("GA001"))
				.andExpect(jsonPath("$[0].nombre").value("Guitarra Acústica Folk"))
				.andExpect(jsonPath("$[0].categoria").value("Guitarras Acústicas"))
				.andExpect(jsonPath("$[0].marca").value("Yamaha"))
				.andExpect(jsonPath("$[0].modelo").value("F310"))
				.andExpect(jsonPath("$[0].precio").value(129990))
				.andExpect(jsonPath("$[0].disponible").value(true))
				.andExpect(jsonPath("$[0].stock").doesNotExist());
	}

	@Test
	void laApiPublicaIndicaCualesProductosSonDestacados() throws Exception {
		mockMvc.perform(get("/api/v1/productos"))
				.andExpect(jsonPath("$[0].destacado").value(true))
				.andExpect(jsonPath("$[?(@.destacado == true)]", hasSize(12)))
				.andExpect(jsonPath("$[?(@.codigo=='AC001')].destacado").value(false));
	}

	@Test
	void elCatalogoTieneLasDiezCategoriasDelExcel() throws Exception {
		mockMvc.perform(get("/api/v1/productos"))
				.andExpect(jsonPath("$[?(@.categoria=='Guitarras Acústicas')]", hasSize(5)))
				.andExpect(jsonPath("$[?(@.categoria=='Estudio y Grabación')]", hasSize(5)))
				.andExpect(jsonPath("$[?(@.categoria=='Accesorios')]", hasSize(10)))
				.andExpect(jsonPath("$[?(@.categoria=='Instrumentos')]").isEmpty());
	}

}
