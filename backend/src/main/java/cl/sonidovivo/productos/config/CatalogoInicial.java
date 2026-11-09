package cl.sonidovivo.productos.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import cl.sonidovivo.productos.dto.ResultadoCatalogo;
import cl.sonidovivo.productos.service.CatalogoService;

/**
 * Siembra el catálogo (catalogo.json) cuando la tabla de productos está vacía.
 * Con {@code app.catalogo.reemplazar=true} (env APP_CATALOGO_REEMPLAZAR) reemplaza además los productos existentes
 * por el catálogo, de forma transaccional; es una acción puntual: por defecto está desactivada.
 */
@Component
public class CatalogoInicial implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(CatalogoInicial.class);

	private final CatalogoService catalogoService;
	private final boolean reemplazar;

	public CatalogoInicial(CatalogoService catalogoService, @Value("${app.catalogo.reemplazar:false}") boolean reemplazar) {
		this.catalogoService = catalogoService;
		this.reemplazar = reemplazar;
	}

	@Override
	public void run(String... args) {
		if (reemplazar) {
			ResultadoCatalogo resultado = catalogoService.reemplazar(catalogoService.leerCatalogo());
			log.info("Catálogo reemplazado: {} agregados, {} actualizados, {} productos anteriores eliminados",
					resultado.agregados(), resultado.actualizados(), resultado.eliminados());
			return;
		}

		int agregados = catalogoService.cargarSiVacio(catalogoService.leerCatalogo());
		if (agregados > 0) {
			log.info("Catálogo inicial cargado: {} productos", agregados);
		}
	}

}
