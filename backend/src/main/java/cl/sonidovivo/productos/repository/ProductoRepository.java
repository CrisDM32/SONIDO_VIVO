package cl.sonidovivo.productos.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import cl.sonidovivo.productos.model.Producto;

@Repository
public class ProductoRepository {

	// Datos actuales del sistema (mismos que src/data/productos.js del frontend)
	private final List<Producto> productos = List.of(
			new Producto(1, "Guitarra Acústica Yamaha", "Instrumentos", 189990, "🎸", true),
			new Producto(2, "Bajo Eléctrico Fender Precision", "Instrumentos", 459990, "🎸", true),
			new Producto(3, "Batería Acústica 5 piezas", "Instrumentos", 650000, "🥁", false),
			new Producto(4, "Teclado Yamaha PSR", "Instrumentos", 299990, "🎹", true),
			new Producto(5, "Amplificador Fender Champion 20", "Instrumentos", 149990, "🔈", true),
			new Producto(6, "Micrófono Shure SM58", "Accesorios", 89990, "🎤", true),
			new Producto(7, "Cable de instrumento 3 metros", "Accesorios", 8990, "🔌", true),
			new Producto(8, "Pedal de efectos Boss DS-1", "Accesorios", 45990, "🎛️", true),
			new Producto(9, "Correa para guitarra", "Accesorios", 12990, "🎸", true),
			new Producto(10, "Interfaz de audio Focusrite 2i2", "Estudio de Grabación", 159990, "🎚️", true),
			new Producto(11, "Monitores de estudio KRK Rokit 5", "Estudio de Grabación", 289990, "🔊", false),
			new Producto(12, "Audífonos de estudio Audio-Technica", "Estudio de Grabación", 69990, "🎧", true));

	public List<Producto> findAll() {
		return productos;
	}

}
