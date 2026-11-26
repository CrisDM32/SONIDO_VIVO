package cl.sonidovivo.productos;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse.BodyHandlers;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SwaggerTest {

	@LocalServerPort
	private int puerto;

	private final HttpClient cliente = HttpClient.newHttpClient();
	private final ObjectMapper json = new ObjectMapper();

	private HttpRequest.Builder peticion(String ruta) {
		return HttpRequest.newBuilder(URI.create("http://localhost:" + puerto + ruta));
	}

	@Test
	void documentacionPublicaYConsultaAdministrativaConJwt() throws Exception {
		var ui = cliente.send(peticion("/swagger-ui/index.html").GET().build(), BodyHandlers.ofString());
		assertEquals(200, ui.statusCode());
		assertTrue(ui.body().contains("swagger-ui"));

		var docs = cliente.send(peticion("/v3/api-docs").GET().build(), BodyHandlers.ofString());
		assertEquals(200, docs.statusCode());
		var spec = json.readTree(docs.body());
		assertEquals("/", spec.at("/servers/0/url").asString());
		assertEquals("bearer", spec.at("/components/securitySchemes/bearerAuth/scheme").asString());
		assertTrue(spec.at("/paths/~1api~1v1~1admin~1usuarios/get/security/0").has("bearerAuth"));
		assertTrue(spec.at("/paths/~1api~1v1~1auth~1login/post/security").isMissingNode());

		var usuarios = peticion("/api/v1/admin/usuarios").GET();
		assertEquals(401, cliente.send(usuarios.build(), BodyHandlers.discarding()).statusCode());
		var login = peticion("/api/v1/auth/login").header("Content-Type", "application/json")
				.POST(HttpRequest.BodyPublishers.ofString("""
						{"correo":"admin@sonidovivo.cl","clave":"admin-test"}
						""")).build();
		var respuesta = cliente.send(login, BodyHandlers.ofString());
		assertEquals(200, respuesta.statusCode());
		String token = json.readTree(respuesta.body()).get("token").asString();
		usuarios.header("Authorization", "Bearer " + token);
		assertEquals(200, cliente.send(usuarios.build(), BodyHandlers.discarding()).statusCode());
	}
}
