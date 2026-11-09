package cl.sonidovivo.productos.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProductoRequest(
		@NotBlank(message = "Escribe el nombre del producto") @Size(min = 3, max = 120, message = "El nombre debe tener entre 3 y 120 caracteres") String nombre,
		@NotBlank(message = "Selecciona una categoría") @Pattern(regexp = "Instrumentos|Accesorios|Estudio de Grabación", message = "La categoría no es válida") String categoria,
		@NotNull(message = "Ingresa el precio") @Min(value = 1, message = "El precio debe ser mayor que 0") @Max(value = 100000000, message = "El precio es demasiado alto") Integer precio,
		@NotNull(message = "Ingresa el stock") @Min(value = 0, message = "El stock no puede ser negativo") @Max(value = 100000, message = "El stock es demasiado alto") Integer stock,
		@NotBlank(message = "Ingresa un icono") @Size(max = 16, message = "El icono es demasiado largo") String icono) {
}
