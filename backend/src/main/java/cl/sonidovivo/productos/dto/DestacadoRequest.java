package cl.sonidovivo.productos.dto;

import jakarta.validation.constraints.NotNull;

public record DestacadoRequest(@NotNull(message = "Indica si el producto es destacado") Boolean destacado) {
}
