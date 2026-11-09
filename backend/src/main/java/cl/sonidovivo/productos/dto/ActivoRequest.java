package cl.sonidovivo.productos.dto;

import jakarta.validation.constraints.NotNull;

public record ActivoRequest(@NotNull(message = "Indica si el producto está activo") Boolean activo) {
}
