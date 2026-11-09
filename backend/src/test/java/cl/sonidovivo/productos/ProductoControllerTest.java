package cl.sonidovivo.productos;

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

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

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
	void listarDevuelveElCatalogoSembradoSinExponerElStock() throws Exception {
		mockMvc.perform(get("/api/v1/productos"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(12))
				.andExpect(jsonPath("$[0].id").value(1))
				.andExpect(jsonPath("$[0].nombre").value("Guitarra Acústica Yamaha"))
				.andExpect(jsonPath("$[0].disponible").value(true))
				.andExpect(jsonPath("$[0].stock").doesNotExist())
				.andExpect(jsonPath("$[2].disponible").value(false));
	}

}
