package cl.sonidovivo.productos.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.sonidovivo.productos.dto.ItemCatalogo;
import cl.sonidovivo.productos.dto.ResultadoCatalogo;
import cl.sonidovivo.productos.model.Categorias;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.ProductoRepository;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

/** Carga del catálogo de Sonido Vivo (catalogo.json) en la tabla de productos. */
@Service
public class CatalogoService {

	private static final String RECURSO = "catalogo.json";

	private final ProductoRepository productoRepository;
	private final JsonMapper jsonMapper = JsonMapper.builder().build();

	public CatalogoService(ProductoRepository productoRepository) {
		this.productoRepository = productoRepository;
	}

	public List<ItemCatalogo> leerCatalogo() {
		try (InputStream entrada = new ClassPathResource(RECURSO).getInputStream()) {
			return jsonMapper.readValue(entrada, new TypeReference<List<ItemCatalogo>>() {
			});
		} catch (IOException ex) {
			throw new IllegalStateException("No se pudo leer " + RECURSO, ex);
		}
	}

	/** Inserta el catálogo solo si no hay ningún producto (instalaciones nuevas). Devuelve cuántos agregó. */
	@Transactional
	public int cargarSiVacio(List<ItemCatalogo> catalogo) {
		if (productoRepository.count() > 0) {
			return 0;
		}
		return reemplazar(catalogo).agregados();
	}

	/**
	 * Deja en la tabla exactamente el catálogo: agrega o actualiza cada producto por su código y elimina todo lo
	 * demás. Es una sola transacción: si algo falla, no se agrega ni se elimina nada.
	 */
	@Transactional
	public ResultadoCatalogo reemplazar(List<ItemCatalogo> catalogo) {
		validar(catalogo);

		Set<String> codigos = new HashSet<>();
		catalogo.forEach(item -> codigos.add(item.codigo()));

		List<Producto> obsoletos = productoRepository.findAll().stream()
				.filter(p -> p.getCodigo() == null || !codigos.contains(p.getCodigo()))
				.toList();
		productoRepository.deleteAll(obsoletos);
		// Se aplica el borrado antes de insertar: un nombre repetido entre un producto anterior y uno nuevo no choca.
		productoRepository.flush();

		int agregados = 0;
		int actualizados = 0;
		for (ItemCatalogo item : catalogo) {
			Producto producto = productoRepository.findByCodigo(item.codigo()).orElse(null);
			if (producto == null) {
				producto = new Producto();
				// El destacado inicial solo se aplica a productos nuevos: no pisa lo que el administrador eligió.
				producto.setDestacado(item.destacado());
				agregados++;
			} else {
				actualizados++;
			}
			aplicar(producto, item);
			productoRepository.saveAndFlush(producto);
		}

		// Comprobación final: si no quedó exactamente el catálogo, se revierte todo.
		if (productoRepository.count() != catalogo.size()) {
			throw new IllegalStateException("El catálogo no quedó completo; se revierte la carga");
		}

		return new ResultadoCatalogo(agregados, actualizados, obsoletos.size());
	}

	private void aplicar(Producto producto, ItemCatalogo item) {
		producto.setCodigo(item.codigo());
		producto.setNombre(item.nombre());
		producto.setCategoria(item.categoria());
		producto.setMarca(item.marca());
		producto.setModelo(item.modelo());
		producto.setDescripcion(item.descripcion());
		producto.setPrecio(item.precio());
		producto.setStock(item.stock());
		producto.setIcono(item.icono());
		producto.setActivo(true);
	}

	private void validar(List<ItemCatalogo> catalogo) {
		if (catalogo == null || catalogo.isEmpty()) {
			throw new IllegalArgumentException("El catálogo está vacío");
		}

		Set<String> codigos = new HashSet<>();
		Set<String> nombres = new HashSet<>();
		for (ItemCatalogo item : catalogo) {
			String id = "Producto " + item.codigo();
			exigirTexto(item.codigo(), 20, id + ": código");
			exigirTexto(item.nombre(), 120, id + ": nombre");
			exigirTexto(item.icono(), 16, id + ": icono");
			if (tamano(item.marca()) > 60 || tamano(item.modelo()) > 60 || tamano(item.descripcion()) > 500) {
				throw new IllegalArgumentException(id + ": marca, modelo o descripción demasiado largos");
			}
			if (!Categorias.TODAS.contains(item.categoria())) {
				throw new IllegalArgumentException(id + ": categoría desconocida (" + item.categoria() + ")");
			}
			if (item.precio() <= 0 || item.stock() < 0) {
				throw new IllegalArgumentException(id + ": precio o stock inválido");
			}
			if (!codigos.add(item.codigo().toLowerCase(Locale.ROOT))) {
				throw new IllegalArgumentException("Código repetido: " + item.codigo());
			}
			if (!nombres.add(item.nombre().toLowerCase(Locale.ROOT))) {
				throw new IllegalArgumentException("Nombre repetido: " + item.nombre());
			}
		}
	}

	private int tamano(String texto) {
		return texto == null ? 0 : texto.length();
	}

	private void exigirTexto(String valor, int maximo, String campo) {
		if (valor == null || valor.isBlank() || valor.length() > maximo) {
			throw new IllegalArgumentException(campo + " vacío o demasiado largo");
		}
	}

}
