package cl.sonidovivo.usuarios.exception;

import org.springframework.http.HttpStatus;

/** Excepcion de negocio simple: lleva su propio codigo HTTP. */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String mensaje) {
        super(mensaje);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
