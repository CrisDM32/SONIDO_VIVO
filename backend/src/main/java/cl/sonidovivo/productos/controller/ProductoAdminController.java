package cl.sonidovivo.productos.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import cl.sonidovivo.productos.dto.ActivoRequest;
import cl.sonidovivo.productos.dto.DestacadoRequest;
import cl.sonidovivo.productos.dto.ProductoAdminResponse;
import cl.sonidovivo.productos.dto.ProductoRequest;
import cl.sonidovivo.productos.dto.StockRequest;
import cl.sonidovivo.productos.service.ProductoAdminService;
import jakarta.validation.Valid;

/** Gestión del catálogo: administrador y vendedor (se restringe en SeguridadConfig). */
@RestController
@RequestMapping("/api/v1/admin/productos")
public class ProductoAdminController {

	private final ProductoAdminService productoAdminService;

	public ProductoAdminController(ProductoAdminService productoAdminService) {
		this.productoAdminService = productoAdminService;
	}

	@GetMapping
	public List<ProductoAdminResponse> listar(
			@RequestParam(required = false) String q,
			@RequestParam(required = false) String categoria) {
		return productoAdminService.listar(q, categoria);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ProductoAdminResponse crear(@Valid @RequestBody ProductoRequest request) {
		return productoAdminService.crear(request);
	}

	@PutMapping("/{id}")
	public ProductoAdminResponse actualizar(@PathVariable Long id, @Valid @RequestBody ProductoRequest request) {
		return productoAdminService.actualizar(id, request);
	}

	@PatchMapping("/{id}/stock")
	public ProductoAdminResponse cambiarStock(@PathVariable Long id, @RequestBody StockRequest request) {
		return productoAdminService.cambiarStock(id, request);
	}

	@PatchMapping("/{id}/destacado")
	public ProductoAdminResponse cambiarDestacado(@PathVariable Long id, @Valid @RequestBody DestacadoRequest request) {
		return productoAdminService.cambiarDestacado(id, request.destacado());
	}

	@PatchMapping("/{id}/activo")
	public ProductoAdminResponse cambiarActivo(@PathVariable Long id, @Valid @RequestBody ActivoRequest request) {
		return productoAdminService.cambiarActivo(id, request.activo());
	}

}
