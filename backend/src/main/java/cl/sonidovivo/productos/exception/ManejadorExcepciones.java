package cl.sonidovivo.productos.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class ManejadorExcepciones {

	private static final Logger log = LoggerFactory.getLogger(ManejadorExcepciones.class);

	@ExceptionHandler(CredencialesInvalidasException.class)
	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	public Map<String, String> credenciales(CredencialesInvalidasException ex) {
		return Map.of("mensaje", ex.getMessage());
	}

	@ExceptionHandler(DatoDuplicadoException.class)
	@ResponseStatus(HttpStatus.CONFLICT)
	public Map<String, String> duplicado(DatoDuplicadoException ex) {
		return Map.of("mensaje", ex.getMessage(), "campo", ex.getCampo());
	}

	@ExceptionHandler(ReglaNegocioException.class)
	@ResponseStatus(HttpStatus.CONFLICT)
	public Map<String, String> reglaNegocio(ReglaNegocioException ex) {
		return Map.of("mensaje", ex.getMessage());
	}

	@ExceptionHandler(RecursoNoEncontradoException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public Map<String, String> noEncontrado(RecursoNoEncontradoException ex) {
		return Map.of("mensaje", ex.getMessage());
	}

	@ExceptionHandler(DatoInvalidoException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public Map<String, String> datoInvalido(DatoInvalidoException ex) {
		return Map.of("mensaje", ex.getMessage(), "campo", ex.getCampo());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public Map<String, Object> validacion(MethodArgumentNotValidException ex) {
		Map<String, String> errores = new LinkedHashMap<>();
		for (FieldError error : ex.getBindingResult().getFieldErrors()) {
			errores.putIfAbsent(error.getField(), error.getDefaultMessage());
		}
		String primero = errores.values().stream().findFirst().orElse("Datos inválidos");
		return Map.of("mensaje", primero, "errores", errores);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public Map<String, String> cuerpoInvalido(HttpMessageNotReadableException ex) {
		return Map.of("mensaje", "El cuerpo de la solicitud no es válido");
	}

	@ExceptionHandler(NoResourceFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public Map<String, String> rutaInexistente(NoResourceFoundException ex) {
		return Map.of("mensaje", "Recurso no encontrado");
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	@ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
	public Map<String, String> metodoNoPermitido(HttpRequestMethodNotSupportedException ex) {
		return Map.of("mensaje", "Método no permitido");
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> inesperado(Exception ex) {
		log.error("Error no controlado", ex);
		return Map.of("mensaje", "Error interno del servidor");
	}

}
