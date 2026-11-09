package cl.sonidovivo.productos.dto;

import cl.sonidovivo.productos.model.Producto;

/** Lo que ve cualquier visitante del catálogo: sin el stock exacto. */
public record ProductoPublico(
		Long id, String codigo, String nombre, String categoria, String marca, String modelo, String descripcion,
		int precio, String icono, boolean disponible, boolean destacado) {

	public static ProductoPublico de(Producto p) {
		return new ProductoPublico(p.getId(), p.getCodigo(), p.getNombre(), p.getCategoria(), p.getMarca(), p.getModelo(),
				p.getDescripcion(), p.getPrecio(), p.getIcono(), p.isDisponible(), p.isDestacado());
	}

}
