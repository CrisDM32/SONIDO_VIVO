package cl.sonidovivo.productos.util;

public final class Rut {

	private Rut() {
	}

	/** Quita puntos, guion y espacios y pasa a mayúscula: "12.345.678-k" -> "12345678K". */
	public static String normalizar(String rut) {
		if (rut == null) {
			return "";
		}
		return rut.replaceAll("[.\\s-]", "").toUpperCase();
	}

	/** Valida formato y dígito verificador (módulo 11). Acepta el RUT con o sin formato. */
	public static boolean esValido(String rut) {
		String limpio = normalizar(rut);
		if (!limpio.matches("[0-9]{7,8}[0-9K]")) {
			return false;
		}

		String cuerpo = limpio.substring(0, limpio.length() - 1);
		char digito = limpio.charAt(limpio.length() - 1);

		int suma = 0;
		int multiplicador = 2;
		for (int i = cuerpo.length() - 1; i >= 0; i--) {
			suma += Character.getNumericValue(cuerpo.charAt(i)) * multiplicador;
			multiplicador = multiplicador == 7 ? 2 : multiplicador + 1;
		}

		int resto = 11 - (suma % 11);
		char esperado = resto == 11 ? '0' : resto == 10 ? 'K' : (char) ('0' + resto);
		return digito == esperado;
	}

}
