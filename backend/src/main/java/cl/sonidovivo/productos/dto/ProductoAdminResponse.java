package cl.sonidovivo.productos.dto;

import cl.sonidovivo.productos.model.Producto;

public record ProductoAdminResponse(
		Long id, String nombre, String categoria, int precio, String icono, int stock, boolean activo, boolean disponible) {

	public static ProductoAdminResponse de(Producto p) {
		return new ProductoAdminResponse(p.getId(), p.getNombre(), p.getCategoria(), p.getPrecio(), p.getIcono(),
				p.getStock(), p.isActivo(), p.isDisponible());
	}

}
