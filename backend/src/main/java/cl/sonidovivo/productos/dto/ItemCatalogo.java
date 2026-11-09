package cl.sonidovivo.productos.dto;

/** Una fila del catálogo (catalogo.json, generado del Excel de Sonido Vivo). */
public record ItemCatalogo(
		String codigo, String categoria, String nombre, String marca, String modelo, int stock, int precio,
		String descripcion, String icono, boolean destacado) {
}
