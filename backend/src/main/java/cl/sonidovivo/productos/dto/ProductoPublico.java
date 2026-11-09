package cl.sonidovivo.productos.dto;

import cl.sonidovivo.productos.model.Producto;

/** Lo que ve cualquier visitante del catálogo: sin el stock exacto. */
public record ProductoPublico(Long id, String nombre, String categoria, int precio, String icono, boolean disponible) {

	public static ProductoPublico de(Producto p) {
		return new ProductoPublico(p.getId(), p.getNombre(), p.getCategoria(), p.getPrecio(), p.getIcono(), p.isDisponible());
	}

}
