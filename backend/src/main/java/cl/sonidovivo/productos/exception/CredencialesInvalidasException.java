package cl.sonidovivo.productos.exception;

public class CredencialesInvalidasException extends RuntimeException {

	public CredencialesInvalidasException() {
		super("Correo o clave incorrectos");
	}

}
