package cl.sonidovivo.productos.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.sonidovivo.productos.dto.ProductoAdminResponse;
import cl.sonidovivo.productos.dto.ProductoRequest;
import cl.sonidovivo.productos.dto.StockRequest;
import cl.sonidovivo.productos.exception.DatoDuplicadoException;
import cl.sonidovivo.productos.exception.DatoInvalidoException;
import cl.sonidovivo.productos.exception.RecursoNoEncontradoException;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.ProductoRepository;

@Service
public class ProductoAdminService {

	private static final int STOCK_MAXIMO = 100000;
	private static final String NOMBRE_DUPLICADO = "Ya existe un producto con ese nombre";
	private static final String CODIGO_DUPLICADO = "Ya existe un producto con ese código";

	private final ProductoRepository productoRepository;

	public ProductoAdminService(ProductoRepository productoRepository) {
		this.productoRepository = productoRepository;
	}

	@Transactional(readOnly = true)
	public List<ProductoAdminResponse> listar(String q, String categoria) {
		String texto = q == null ? "" : q.trim().toLowerCase();
		String categoriaFiltro = categoria == null ? "" : categoria.trim();

		// El catálogo es pequeño: filtrar en memoria evita consultas con parámetros nulos (problemáticas en PostgreSQL).
		return productoRepository.findAll(Sort.by("id")).stream()
				.filter(p -> categoriaFiltro.isEmpty() || p.getCategoria().equals(categoriaFiltro))
				.filter(p -> texto.isEmpty() || p.getNombre().toLowerCase().contains(texto))
				.map(ProductoAdminResponse::de)
				.toList();
	}

	@Transactional
	public ProductoAdminResponse crear(ProductoRequest request) {
		String nombre = request.nombre().trim();
		if (productoRepository.existsByNombreIgnoreCase(nombre)) {
			throw new DatoDuplicadoException("nombre", NOMBRE_DUPLICADO);
		}
		if (productoRepository.existsByCodigoIgnoreCase(request.codigo().trim())) {
			throw new DatoDuplicadoException("codigo", CODIGO_DUPLICADO);
		}

		Producto producto = new Producto();
		aplicar(producto, request);
		return guardar(producto);
	}

	@Transactional
	public ProductoAdminResponse actualizar(Long id, ProductoRequest request) {
		Producto producto = buscar(id);
		if (productoRepository.existsByNombreIgnoreCaseAndIdNot(request.nombre().trim(), id)) {
			throw new DatoDuplicadoException("nombre", NOMBRE_DUPLICADO);
		}
		if (productoRepository.existsByCodigoIgnoreCaseAndIdNot(request.codigo().trim(), id)) {
			throw new DatoDuplicadoException("codigo", CODIGO_DUPLICADO);
		}

		aplicar(producto, request);
		return guardar(producto);
	}

	@Transactional
	public ProductoAdminResponse cambiarStock(Long id, StockRequest request) {
		if ((request.stock() == null) == (request.delta() == null)) {
			throw new DatoInvalidoException("stock", "Indica el stock o la cantidad a sumar o restar");
		}

		Producto producto = buscar(id);
		long nuevo = request.stock() != null ? request.stock() : (long) producto.getStock() + request.delta();
		if (nuevo < 0) {
			throw new DatoInvalidoException("stock", "El stock no puede ser negativo");
		}
		if (nuevo > STOCK_MAXIMO) {
			throw new DatoInvalidoException("stock", "El stock es demasiado alto");
		}

		producto.setStock((int) nuevo);
		return ProductoAdminResponse.de(productoRepository.save(producto));
	}

	@Transactional
	public ProductoAdminResponse cambiarActivo(Long id, boolean activo) {
		Producto producto = buscar(id);
		producto.setActivo(activo);
		return ProductoAdminResponse.de(productoRepository.save(producto));
	}

	@Transactional
	public ProductoAdminResponse cambiarDestacado(Long id, boolean destacado) {
		Producto producto = buscar(id);
		producto.setDestacado(destacado);
		return ProductoAdminResponse.de(productoRepository.save(producto));
	}

	private Producto buscar(Long id) {
		return productoRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado"));
	}

	private void aplicar(Producto producto, ProductoRequest request) {
		producto.setCodigo(request.codigo().trim());
		producto.setNombre(request.nombre().trim());
		producto.setCategoria(request.categoria());
		producto.setMarca(textoOpcional(request.marca()));
		producto.setModelo(textoOpcional(request.modelo()));
		producto.setDescripcion(textoOpcional(request.descripcion()));
		producto.setPrecio(request.precio());
		producto.setStock(request.stock());
		producto.setIcono(request.icono().trim());
		// Si la petición no lo informa, se conserva el valor actual (un producto nuevo parte en false).
		if (request.destacado() != null) {
			producto.setDestacado(request.destacado());
		}
	}

	private String textoOpcional(String texto) {
		return texto == null || texto.isBlank() ? null : texto.trim();
	}

	private ProductoAdminResponse guardar(Producto producto) {
		try {
			return ProductoAdminResponse.de(productoRepository.saveAndFlush(producto));
		} catch (DataIntegrityViolationException ex) {
			// Dos altas simultáneas con el mismo nombre o código: la restricción única de la BD es la última defensa.
			if (productoRepository.existsByCodigoIgnoreCase(producto.getCodigo())) {
				throw new DatoDuplicadoException("codigo", CODIGO_DUPLICADO);
			}
			throw new DatoDuplicadoException("nombre", NOMBRE_DUPLICADO);
		}
	}

}
