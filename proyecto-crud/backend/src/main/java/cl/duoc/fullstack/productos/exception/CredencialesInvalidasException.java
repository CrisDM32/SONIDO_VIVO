package cl.duoc.fullstack.productos.exception;

public class CredencialesInvalidasException extends RuntimeException {

    public CredencialesInvalidasException() {
        super("Correo o clave incorrectos");
    }
}
