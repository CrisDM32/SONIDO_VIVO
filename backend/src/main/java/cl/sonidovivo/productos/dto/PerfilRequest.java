package cl.sonidovivo.productos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PerfilRequest(
		@NotBlank(message = "Selecciona un perfil") @Pattern(regexp = "administrador|vendedor|cliente", message = "El perfil no es válido") String perfil) {
}
