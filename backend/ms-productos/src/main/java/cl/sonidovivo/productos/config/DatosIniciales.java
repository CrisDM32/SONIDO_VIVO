package cl.sonidovivo.productos.config;

import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Carga el mismo catalogo de 12 productos que antes estaba hardcodeado en
 * frontend/src/data/productos.js, pero solo la primera vez que arranca el
 * servicio (si la tabla ya tiene datos, no hace nada). Asi la demo y las
 * pruebas en Swagger tienen datos reales sin tener que crearlos a mano.
 */
@Component
public class DatosIniciales implements CommandLineRunner {

    private final ProductoRepository productoRepository;

    public DatosIniciales(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    public void run(String... args) {
        if (productoRepository.count() > 0) {
            return;
        }

        productoRepository.saveAll(java.util.List.of(
                nuevo("Guitarra Acustica Yamaha", "Instrumentos", 189990, 5, "🎸"),
                nuevo("Bajo Electrico Fender Precision", "Instrumentos", 459990, 3, "🎸"),
                nuevo("Bateria Acustica 5 piezas", "Instrumentos", 650000, 0, "🥁"),
                nuevo("Teclado Yamaha PSR", "Instrumentos", 299990, 4, "🎹"),
                nuevo("Amplificador Fender Champion 20", "Instrumentos", 149990, 6, "🔈"),
                nuevo("Microfono Shure SM58", "Accesorios", 89990, 10, "🎤"),
                nuevo("Cable de instrumento 3 metros", "Accesorios", 8990, 25, "🔌"),
                nuevo("Pedal de efectos Boss DS-1", "Accesorios", 45990, 7, "🎛️"),
                nuevo("Correa para guitarra", "Accesorios", 12990, 15, "🎸"),
                nuevo("Interfaz de audio Focusrite 2i2", "Estudio de Grabacion", 159990, 4, "🎚️"),
                nuevo("Monitores de estudio KRK Rokit 5", "Estudio de Grabacion", 289990, 0, "🔊"),
                nuevo("Audifonos de estudio Audio-Technica", "Estudio de Grabacion", 69990, 8, "🎧")
        ));
    }

    private Producto nuevo(String nombre, String categoria, double precio, int stock, String icono) {
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setCategoria(categoria);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setIcono(icono);
        return producto;
    }
}
