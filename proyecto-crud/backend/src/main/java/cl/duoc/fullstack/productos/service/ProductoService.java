package cl.duoc.fullstack.productos.service;

import cl.duoc.fullstack.productos.dto.ProductoRequest;
import cl.duoc.fullstack.productos.dto.ProductoResponse;
import java.util.List;

public interface ProductoService {

    List<ProductoResponse> listar();

    ProductoResponse obtenerPorId(Long id);

    ProductoResponse crear(ProductoRequest request);

    ProductoResponse actualizar(Long id, ProductoRequest request);

    void eliminar(Long id);
}
