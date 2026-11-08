package cl.duoc.fullstack.productos.service;

import cl.duoc.fullstack.productos.dto.ProductoRequest;
import cl.duoc.fullstack.productos.dto.ProductoResponse;
import cl.duoc.fullstack.productos.exception.RecursoNoEncontradoException;
import cl.duoc.fullstack.productos.model.Producto;
import cl.duoc.fullstack.productos.repository.ProductoRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponse> listar() {
        return productoRepository.findAllByOrderByNombreAsc()
                .stream()
                .map(this::aRespuesta)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponse obtenerPorId(Long id) {
        return aRespuesta(buscar(id));
    }

    @Override
    public ProductoResponse crear(ProductoRequest request) {
        Producto producto = new Producto();
        aplicar(producto, request);
        return aRespuesta(productoRepository.save(producto));
    }

    @Override
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = buscar(id);
        aplicar(producto, request);
        return aRespuesta(productoRepository.save(producto));
    }

    @Override
    public void eliminar(Long id) {
        Producto producto = buscar(id);
        productoRepository.delete(producto);
    }

    private Producto buscar(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado"));
    }

    private void aplicar(Producto producto, ProductoRequest request) {
        producto.setImagen(request.imagen().trim());
        producto.setNombre(request.nombre().trim());
        producto.setStock(request.stock());
        producto.setPrecio(request.precio());
    }

    private ProductoResponse aRespuesta(Producto producto) {
        return new ProductoResponse(
                producto.getId(),
                producto.getImagen(),
                producto.getNombre(),
                producto.getStock(),
                producto.getPrecio()
        );
    }
}
