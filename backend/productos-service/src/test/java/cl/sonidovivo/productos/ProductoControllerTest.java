package cl.sonidovivo.productos;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import cl.sonidovivo.productos.controller.ProductoController;
import cl.sonidovivo.productos.repository.ProductoRepository;

class ProductoControllerTest {

	private MockMvc mockMvc;

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.standaloneSetup(new ProductoController(new ProductoRepository())).build();
	}

	@Test
	void listarDevuelveLosProductosActuales() throws Exception {
		mockMvc.perform(get("/api/productos"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(12))
				.andExpect(jsonPath("$[0].nombre").value("Guitarra Acústica Yamaha"))
				.andExpect(jsonPath("$[2].disponible").value(false));
	}

}
