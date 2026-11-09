package cl.sonidovivo.productos.exception;

/** Una operación válida en forma pero que la regla de negocio no permite (409). */
public class ReglaNegocioException extends RuntimeException {

	public ReglaNegocioException(String mensaje) {
		super(mensaje);
	}

}
