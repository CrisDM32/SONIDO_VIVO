package cl.sonidovivo.productos.dto;

/** Se informa exactamente uno: {@code stock} (valor absoluto) o {@code delta} (suma o resta). */
public record StockRequest(Integer stock, Integer delta) {
}
