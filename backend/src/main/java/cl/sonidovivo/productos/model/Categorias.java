package cl.sonidovivo.productos.model;

import java.util.List;

public final class Categorias {

	public static final String REGEX = "Guitarras Acústicas|Guitarras Eléctricas|Bajos Eléctricos|Baterías|"
			+ "Teclados y Pianos|Amplificadores|Micrófonos|Pedales de Efectos|Accesorios|Estudio y Grabación";

	public static final List<String> TODAS = List.of(REGEX.split("[|]"));

	private Categorias() {
	}

}
