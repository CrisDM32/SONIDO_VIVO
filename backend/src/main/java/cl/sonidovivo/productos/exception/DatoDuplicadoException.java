package cl.sonidovivo.productos.exception;

public class DatoDuplicadoException extends RuntimeException {

	private final String campo;

	public DatoDuplicadoException(String campo, String mensaje) {
		super(mensaje);
		this.campo = campo;
	}

	public String getCampo() {
		return campo;
	}

}
