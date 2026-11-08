package cl.duoc.fullstack.productos.config;

import cl.duoc.fullstack.productos.model.Producto;
import cl.duoc.fullstack.productos.model.Usuario;
import cl.duoc.fullstack.productos.repository.ProductoRepository;
import cl.duoc.fullstack.productos.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatosIniciales implements CommandLineRunner {

    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final String baseUrl;

    public DatosIniciales(
            ProductoRepository productoRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.public-base-url}") String baseUrl) {
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.baseUrl = baseUrl;
    }

    @Override
    public void run(String... args) {
        crearAdministrador();

        if (productoRepository.count() > 0) {
            return;
        }

        productoRepository.saveAll(List.of(
                producto("cafe.svg", "Café de grano", 24, "8990.00"),
                producto("cuaderno.svg", "Cuaderno universitario", 40, "2490.00"),
                producto("audifonos.svg", "Audífonos inalámbricos", 8, "24990.00"),
                producto("botella.svg", "Botella térmica", 15, "12990.00")
        ));
    }

    private void crearAdministrador() {
        if (usuarioRepository.findByCorreo("admin@almacen.com").isPresent()) {
            return;
        }

        Usuario usuario = new Usuario();
        usuario.setNombre("John Parra");
        usuario.setCorreo("admin@almacen.com");
        usuario.setClave(passwordEncoder.encode("admin"));
        usuario.setPerfil("administrador");
        usuarioRepository.save(usuario);
    }

    private Producto producto(String archivo, String nombre, int stock, String precio) {
        Producto producto = new Producto();
        producto.setImagen(urlImagen(archivo));
        producto.setNombre(nombre);
        producto.setStock(stock);
        producto.setPrecio(new BigDecimal(precio));
        return producto;
    }

    private String urlImagen(String archivo) {
        String base = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        return base + "/imagenes/" + archivo;
    }
}
