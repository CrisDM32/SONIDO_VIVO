package cl.duoc.fullstack.productos.dto;

import java.math.BigDecimal;

public record ProductoResponse(
        Long id,
        String imagen,
        String nombre,
        Integer stock,
        BigDecimal precio
) {
}
