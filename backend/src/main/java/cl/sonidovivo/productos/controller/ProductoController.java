package cl.sonidovivo.productos.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.sonidovivo.productos.dto.ProductoPublico;
import cl.sonidovivo.productos.repository.ProductoRepository;

@Tag(name = "Catálogo", description = "Consulta pública de productos activos.")
@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

	private final ProductoRepository productoRepository;

	public ProductoController(ProductoRepository productoRepository) {
		this.productoRepository = productoRepository;
	}

	@GetMapping
	public List<ProductoPublico> listar() {
		return productoRepository.findByActivoTrueOrderByIdAsc().stream().map(ProductoPublico::de).toList();
	}

}
