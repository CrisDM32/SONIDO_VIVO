package cl.sonidovivo.productos.exception;

public class DatoInvalidoException extends RuntimeException {

	private final String campo;

	public DatoInvalidoException(String campo, String mensaje) {
		super(mensaje);
		this.campo = campo;
	}

	public String getCampo() {
		return campo;
	}

}
