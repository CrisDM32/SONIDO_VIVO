package cl.sonidovivo.productos.dto;

public record ItemCatalogo(
		String codigo, String categoria, String nombre, String marca, String modelo, int stock, int precio,
		String descripcion, String icono, boolean destacado) {
}
