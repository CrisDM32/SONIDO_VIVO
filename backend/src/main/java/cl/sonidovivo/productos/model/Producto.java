package cl.sonidovivo.productos.model;

public record Producto(
		int id,
		String nombre,
		String categoria,
		int precio,
		String icono,
		boolean disponible) {
}
