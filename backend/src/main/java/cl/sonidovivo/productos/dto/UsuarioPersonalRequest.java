package cl.sonidovivo.productos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Alta de personal (administrador o vendedor) hecha por un administrador. */
public record UsuarioPersonalRequest(
		@NotBlank(message = "Escribe el nombre completo") @Size(min = 3, max = 120, message = "El nombre debe tener entre 3 y 120 caracteres") String nombre,
		@NotBlank(message = "Ingresa el correo") @Email(message = "Ingresa un correo electrónico válido") @Size(max = 180, message = "El correo es demasiado largo") String correo,
		@NotBlank(message = "Ingresa el RUT") String rut,
		@Pattern(regexp = "^$|^(?=(?:\\D*\\d){8,})[0-9+\\s-]+$", message = "El teléfono no es válido (mínimo 8 dígitos)") @Size(max = 30, message = "El teléfono es demasiado largo") String telefono,
		@NotBlank(message = "Ingresa una contraseña") @Size(min = 8, max = 100, message = "La contraseña debe tener entre 8 y 100 caracteres") @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).*$", message = "La contraseña debe incluir letras y números") String clave,
		@NotBlank(message = "Selecciona un perfil") @Pattern(regexp = "administrador|vendedor", message = "El perfil debe ser administrador o vendedor") String perfil) {
}
