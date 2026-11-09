package cl.sonidovivo.productos;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import cl.sonidovivo.productos.dto.ItemCatalogo;
import cl.sonidovivo.productos.dto.ResultadoCatalogo;
import cl.sonidovivo.productos.model.Producto;
import cl.sonidovivo.productos.repository.ProductoRepository;
import cl.sonidovivo.productos.service.CatalogoService;

/** Estos tests vacían y reescriben la tabla de productos: se descarta el contexto al terminar. */
@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class CatalogoServiceTest {

	@Autowired
	private CatalogoService catalogoService;
	@Autowired
	private ProductoRepository productoRepository;

	@BeforeEach
	void vaciar() {
		productoRepository.deleteAll();
	}

	private Producto anterior(String nombre) {
		Producto p = new Producto(nombre, "Instrumentos", 1000, "🎸", 5);
		return productoRepository.saveAndFlush(p);
	}

	private ItemCatalogo item(String codigo, String nombre) {
		return new ItemCatalogo(codigo, "Accesorios", nombre, "Marca", "M", 3, 5000, "Descripción", "🧰", false);
	}

	@Test
	void elCatalogoDelExcelTiene51ProductosValidos() {
		List<ItemCatalogo> catalogo = catalogoService.leerCatalogo();

		assertEquals(51, catalogo.size());
		assertEquals(10, catalogo.stream().map(ItemCatalogo::categoria).distinct().count());
		assertEquals("GA001", catalogo.get(0).codigo());
	}

	@Test
	void cargarSiVacioInsertaElCatalogoSoloCuandoNoHayProductos() {
		assertEquals(51, catalogoService.cargarSiVacio(catalogoService.leerCatalogo()));
		assertEquals(51, productoRepository.count());

		assertEquals(0, catalogoService.cargarSiVacio(catalogoService.leerCatalogo()));
		assertEquals(51, productoRepository.count());
	}

	@Test
	void reemplazarEliminaLosProductosAnterioresIncluidoElQueComparteNombreConElCatalogo() {
		anterior("Guitarra Acústica Yamaha");
		anterior("Batería Acústica 5 piezas"); // mismo nombre que BT001 del catálogo
		anterior("Teclado Yamaha PSR");

		ResultadoCatalogo resultado = catalogoService.reemplazar(catalogoService.leerCatalogo());

		assertEquals(51, resultado.agregados());
		assertEquals(0, resultado.actualizados());
		assertEquals(3, resultado.eliminados());
		assertEquals(51, productoRepository.count());
		assertTrue(productoRepository.findAll().stream().allMatch(p -> p.getCodigo() != null && p.isActivo()));
		assertFalse(productoRepository.existsByNombreIgnoreCase("Teclado Yamaha PSR"));
		assertEquals("BT001", productoRepository.findAll().stream()
				.filter(p -> p.getNombre().equals("Batería Acústica 5 piezas")).findFirst().orElseThrow().getCodigo());
	}

	@Test
	void reemplazarEsIdempotenteYConservaLosIds() {
		catalogoService.reemplazar(catalogoService.leerCatalogo());
		Long idGa001 = productoRepository.findByCodigo("GA001").orElseThrow().getId();

		ResultadoCatalogo segunda = catalogoService.reemplazar(catalogoService.leerCatalogo());

		assertEquals(0, segunda.agregados());
		assertEquals(51, segunda.actualizados());
		assertEquals(0, segunda.eliminados());
		assertEquals(idGa001, productoRepository.findByCodigo("GA001").orElseThrow().getId());
	}

	@Test
	void unCatalogoInvalidoNoCambiaNada() {
		anterior("Producto anterior");

		List<ItemCatalogo> conCodigoRepetido = List.of(item("AC001", "Uno"), item("ac001", "Dos"));
		assertThrows(IllegalArgumentException.class, () -> catalogoService.reemplazar(conCodigoRepetido));

		List<ItemCatalogo> conCategoriaAjena = List.of(
				new ItemCatalogo("AC001", "Otra", "Uno", "M", "M", 1, 1000, "d", "x", false));
		assertThrows(IllegalArgumentException.class, () -> catalogoService.reemplazar(conCategoriaAjena));

		assertEquals(1, productoRepository.count());
		assertTrue(productoRepository.existsByNombreIgnoreCase("Producto anterior"));
	}

	@Test
	void siFallaEnMitadDeLaCargaSeRevierteTodoYLosAnterioresSiguenAhi() {
		// Existen C1 ("N1") y C2 ("N2") y un producto anterior sin código.
		productoRepository.saveAndFlush(conCodigo("C1", "N1"));
		productoRepository.saveAndFlush(conCodigo("C2", "N2"));
		anterior("Producto anterior");

		// El catálogo intercambia los nombres: pasa la validación, pero choca con la restricción única de la BD
		// recién cuando ya se había eliminado el producto anterior. Debe revertirse todo.
		List<ItemCatalogo> catalogo = List.of(item("C1", "N2"), item("C2", "N1"));
		assertThrows(RuntimeException.class, () -> catalogoService.reemplazar(catalogo));

		assertEquals(3, productoRepository.count());
		assertTrue(productoRepository.existsByNombreIgnoreCase("Producto anterior"));
		assertEquals("N1", productoRepository.findByCodigo("C1").orElseThrow().getNombre());
		assertEquals("N2", productoRepository.findByCodigo("C2").orElseThrow().getNombre());
	}

	@Test
	void elCatalogoDeclaraLosDoceProductosDestacadosIniciales() {
		List<ItemCatalogo> catalogo = catalogoService.leerCatalogo();

		assertEquals(12, catalogo.stream().filter(ItemCatalogo::destacado).count());
		assertEquals("GA001", catalogo.get(0).codigo());
		assertTrue(catalogo.get(0).destacado());
		assertEquals("BA002", catalogo.get(11).codigo());
		assertTrue(catalogo.get(11).destacado());
		assertFalse(catalogo.get(12).destacado());
	}

	@Test
	void reemplazarNoPisaElDestacadoQueElAdministradorEligio() {
		catalogoService.reemplazar(catalogoService.leerCatalogo());
		Producto ga001 = productoRepository.findByCodigo("GA001").orElseThrow();
		Producto ac001 = productoRepository.findByCodigo("AC001").orElseThrow();
		assertTrue(ga001.isDestacado());
		assertFalse(ac001.isDestacado());

		// El administrador cambia dos productos...
		ga001.setDestacado(false);
		ac001.setDestacado(true);
		productoRepository.saveAll(List.of(ga001, ac001));

		// ...y al volver a ejecutar la carga se respetan sus decisiones.
		catalogoService.reemplazar(catalogoService.leerCatalogo());

		assertFalse(productoRepository.findByCodigo("GA001").orElseThrow().isDestacado());
		assertTrue(productoRepository.findByCodigo("AC001").orElseThrow().isDestacado());
	}

	private Producto conCodigo(String codigo, String nombre) {
		Producto p = new Producto(nombre, "Accesorios", 1000, "🧰", 1);
		p.setCodigo(codigo);
		return p;
	}

}
