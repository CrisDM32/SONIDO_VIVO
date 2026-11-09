package cl.sonidovivo.productos;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import cl.sonidovivo.productos.util.Rut;

class RutTest {

	@Test
	void normalizaPuntosGuionYMinuscula() {
		assertEquals("12345678K", Rut.normalizar(" 12.345.678-k "));
	}

	@Test
	void validaElDigitoVerificador() {
		assertTrue(Rut.esValido("12.345.678-5"));
		assertTrue(Rut.esValido("123456785"));
		assertTrue(Rut.esValido("11.111.111-1"));
		assertFalse(Rut.esValido("12.345.678-9"));
		assertFalse(Rut.esValido("abc"));
		assertFalse(Rut.esValido(null));
	}

}
