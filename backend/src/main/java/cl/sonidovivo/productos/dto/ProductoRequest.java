package cl.sonidovivo.productos.dto;

import cl.sonidovivo.productos.model.Categorias;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProductoRequest(
		@NotBlank(message = "Ingresa el código del producto") @Size(min = 3, max = 20, message = "El código debe tener entre 3 y 20 caracteres") String codigo,
		@NotBlank(message = "Escribe el nombre del producto") @Size(min = 3, max = 120, message = "El nombre debe tener entre 3 y 120 caracteres") String nombre,
		@NotBlank(message = "Selecciona una categoría") @Pattern(regexp = Categorias.REGEX, message = "La categoría no es válida") String categoria,
		@Size(max = 60, message = "La marca es demasiado larga") String marca,
		@Size(max = 60, message = "El modelo es demasiado largo") String modelo,
		@Size(max = 500, message = "La descripción es demasiado larga") String descripcion,
		@NotNull(message = "Ingresa el precio") @Min(value = 1, message = "El precio debe ser mayor que 0") @Max(value = 100000000, message = "El precio es demasiado alto") Integer precio,
		@NotNull(message = "Ingresa el stock") @Min(value = 0, message = "El stock no puede ser negativo") @Max(value = 100000, message = "El stock es demasiado alto") Integer stock,
		@NotBlank(message = "Ingresa un icono") @Size(max = 16, message = "El icono es demasiado largo") String icono,
		Boolean destacado) {
}
