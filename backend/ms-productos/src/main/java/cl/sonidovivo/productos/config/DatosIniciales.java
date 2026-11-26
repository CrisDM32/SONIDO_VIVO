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
                nuevo("Guitarra Acustica Yamaha", "Instrumentos", 189990, 5, "🎸",
                        "Guitarra acustica cuerpo dreadnought, tapa de abeto macizo, aros y fondo de caoba. "
                                + "Incluye funda acolchada. Ideal para principiantes e intermedios."),
                nuevo("Bajo Electrico Fender Precision", "Instrumentos", 459990, 3, "🎸",
                        "Bajo electrico de 4 cuerdas, cuerpo de aliso, mastil de arce con diapason de arce. "
                                + "Pastilla Precision Bass de bobina dividida. Incluye cable y correa."),
                nuevo("Bateria Acustica 5 piezas", "Instrumentos", 650000, 0, "🥁",
                        "Set completo de 5 piezas (bombo, tom, tom de piso, redoblante y platillos basicos), "
                                + "cascaras de alamo. Incluye banquillo, baquetas y pedal de bombo."),
                nuevo("Teclado Yamaha PSR", "Instrumentos", 299990, 4, "🎹",
                        "Teclado de 61 teclas sensibles al toque, mas de 300 voces y 150 ritmos preestablecidos. "
                                + "Funciona con pilas o adaptador (incluido). Salida de audifonos."),
                nuevo("Amplificador Fender Champion 20", "Instrumentos", 149990, 6, "🔈",
                        "Amplificador de guitarra de 20W, un canal con modelado de 8 tipos de amplificador, "
                                + "efectos de reverb y delay incorporados. Entrada auxiliar para practicar con pistas."),
                nuevo("Microfono Shure SM58", "Accesorios", 89990, 10, "🎤",
                        "Microfono dinamico cardioide, el estandar de la industria para voz en vivo. "
                                + "Resistente a golpes y humedad. Incluye pinza y bolso de transporte."),
                nuevo("Cable de instrumento 3 metros", "Accesorios", 8990, 25, "🔌",
                        "Cable de instrumento TS de 3 metros, conectores plug 1/4\" niquelados, "
                                + "blindaje de alta densidad contra ruido e interferencias."),
                nuevo("Pedal de efectos Boss DS-1", "Accesorios", 45990, 7, "🎛️",
                        "Pedal de distorsion clasico para guitarra electrica. Controles de tono, nivel y distorsion. "
                                + "Carcasa metalica resistente, funciona a pila 9V o adaptador."),
                nuevo("Correa para guitarra", "Accesorios", 12990, 15, "🎸",
                        "Correa de nylon acolchada, ajustable de 90 a 150 cm, compatible con guitarra "
                                + "acustica, electrica y bajo."),
                nuevo("Interfaz de audio Focusrite 2i2", "Estudio de Grabacion", 159990, 4, "🎚️",
                        "Interfaz de audio USB con 2 entradas combo XLR/TRS y preamplificadores de microfono "
                                + "de alta calidad. Conversion de 24-bit/192kHz. Incluye software de grabacion."),
                nuevo("Monitores de estudio KRK Rokit 5", "Estudio de Grabacion", 289990, 0, "🔊",
                        "Par de monitores de estudio activos de 5 pulgadas, woofer de fibra de vidrio amarilla, "
                                + "ecualizador integrado de 4 posiciones para adaptar la respuesta a la sala."),
                nuevo("Audifonos de estudio Audio-Technica", "Estudio de Grabacion", 69990, 8, "🎧",
                        "Audifonos circumaurales cerrados para monitoreo de estudio, respuesta de frecuencia amplia "
                                + "y buen aislamiento de ruido externo. Cable desmontable de 3 metros.")
        ));
    }

    private Producto nuevo(String nombre, String categoria, double precio, int stock, String icono, String descripcion) {
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setCategoria(categoria);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setIcono(icono);
        producto.setDescripcion(descripcion);
        return producto;
    }
}
