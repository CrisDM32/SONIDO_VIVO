package cl.sonidovivo.productos.model;

import java.util.List;

/** Categorías del catálogo. Misma lista que frontend/src/data/categorias.js. */
public final class Categorias {

	/** Expresión para @Pattern: una única fuente de verdad para la lista de abajo. */
	public static final String REGEX = "Guitarras Acústicas|Guitarras Eléctricas|Bajos Eléctricos|Baterías|"
			+ "Teclados y Pianos|Amplificadores|Micrófonos|Pedales de Efectos|Accesorios|Estudio y Grabación";

	public static final List<String> TODAS = List.of(REGEX.split("[|]"));

	private Categorias() {
	}

}
