package cl.sonidovivo.productos.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.ProductoRepository;

/** Siembra el catálogo inicial (el mismo de src/data/productos.js del frontend) si la tabla está vacía. */
@Component
@Order(1)
public class DatosProductos implements CommandLineRunner {

	private static final int STOCK_INICIAL = 10;

	private final ProductoRepository productoRepository;

	public DatosProductos(ProductoRepository productoRepository) {
		this.productoRepository = productoRepository;
	}

	@Override
	public void run(String... args) {
		if (productoRepository.count() > 0) {
			return;
		}

		// El orden fija los ids 1..12, que son los que ya usan los enlaces /producto/:id y el carrito.
		productoRepository.saveAll(List.of(
				new Producto("Guitarra Acústica Yamaha", "Instrumentos", 189990, "🎸", STOCK_INICIAL),
				new Producto("Bajo Eléctrico Fender Precision", "Instrumentos", 459990, "🎸", STOCK_INICIAL),
				new Producto("Batería Acústica 5 piezas", "Instrumentos", 650000, "🥁", 0),
				new Producto("Teclado Yamaha PSR", "Instrumentos", 299990, "🎹", STOCK_INICIAL),
				new Producto("Amplificador Fender Champion 20", "Instrumentos", 149990, "🔈", STOCK_INICIAL),
				new Producto("Micrófono Shure SM58", "Accesorios", 89990, "🎤", STOCK_INICIAL),
				new Producto("Cable de instrumento 3 metros", "Accesorios", 8990, "🔌", STOCK_INICIAL),
				new Producto("Pedal de efectos Boss DS-1", "Accesorios", 45990, "🎛️", STOCK_INICIAL),
				new Producto("Correa para guitarra", "Accesorios", 12990, "🎸", STOCK_INICIAL),
				new Producto("Interfaz de audio Focusrite 2i2", "Estudio de Grabación", 159990, "🎚️", STOCK_INICIAL),
				new Producto("Monitores de estudio KRK Rokit 5", "Estudio de Grabación", 289990, "🔊", 0),
				new Producto("Audífonos de estudio Audio-Technica", "Estudio de Grabación", 69990, "🎧", STOCK_INICIAL)));
	}

}
