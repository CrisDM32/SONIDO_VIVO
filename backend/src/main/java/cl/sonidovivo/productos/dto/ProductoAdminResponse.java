package cl.sonidovivo.productos.dto;

import cl.sonidovivo.productos.model.Producto;

public record ProductoAdminResponse(
		Long id, String codigo, String nombre, String categoria, String marca, String modelo, String descripcion,
		int precio, String icono, int stock, boolean activo, boolean disponible, boolean destacado) {

	public static ProductoAdminResponse de(Producto p) {
		return new ProductoAdminResponse(p.getId(), p.getCodigo(), p.getNombre(), p.getCategoria(), p.getMarca(),
				p.getModelo(), p.getDescripcion(), p.getPrecio(), p.getIcono(), p.getStock(), p.isActivo(),
				p.isDisponible(), p.isDestacado());
	}

}
