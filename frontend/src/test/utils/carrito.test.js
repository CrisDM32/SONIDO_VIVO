import { afterEach, beforeEach, expect, test } from "vitest";
import {
  actualizarCantidad,
  agregarAlCarrito,
  calcularTotalCarrito,
  eliminarDelCarrito,
  formatearPrecioCLP,
  guardarCarrito,
  obtenerCarrito,
  vaciarCarrito,
} from "../../utils/carrito";

const guitarra = { id: 1, nombre: "Guitarra Acústica Yamaha", precio: 189990, icono: "🎸", categoria: "Instrumentos", disponible: true };
const cable = { id: 7, nombre: "Cable de instrumento 3 metros", precio: 8990, icono: "🔌" };

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

test("el carrito está vacío por defecto", () => {
  expect(obtenerCarrito()).toEqual([]);
});

test("agregar un producto lo guarda con cantidad 1 y solo con los datos necesarios", () => {
  const carrito = agregarAlCarrito(guitarra);

  expect(carrito).toEqual([
    { id: 1, nombre: "Guitarra Acústica Yamaha", precio: 189990, icono: "🎸", cantidad: 1 },
  ]);
});

test("el carrito se guarda en localStorage y se puede leer de nuevo", () => {
  agregarAlCarrito(guitarra);

  expect(JSON.parse(localStorage.getItem("sv_carrito"))).toHaveLength(1);
  expect(obtenerCarrito()[0].nombre).toBe("Guitarra Acústica Yamaha");
});

test("agregar el mismo producto otra vez suma la cantidad en vez de duplicarlo", () => {
  agregarAlCarrito(guitarra);
  agregarAlCarrito(guitarra);
  const carrito = agregarAlCarrito(guitarra);

  expect(carrito).toHaveLength(1);
  expect(carrito[0].cantidad).toBe(3);
});

test("agregar productos distintos crea una línea por producto", () => {
  agregarAlCarrito(guitarra);
  const carrito = agregarAlCarrito(cable);

  expect(carrito.map((item) => item.id)).toEqual([1, 7]);
});

test("actualizarCantidad cambia la cantidad solo del producto indicado", () => {
  agregarAlCarrito(guitarra);
  const carritoConDos = agregarAlCarrito(cable);

  const carrito = actualizarCantidad(carritoConDos, 7, 5);

  expect(carrito.find((item) => item.id === 7).cantidad).toBe(5);
  expect(carrito.find((item) => item.id === 1).cantidad).toBe(1);
  expect(obtenerCarrito()).toEqual(carrito);
});

test("actualizarCantidad nunca deja la cantidad en menos de 1", () => {
  const carrito = agregarAlCarrito(guitarra);

  expect(actualizarCantidad(carrito, 1, 0)[0].cantidad).toBe(1);
  expect(actualizarCantidad(carrito, 1, -4)[0].cantidad).toBe(1);
});

test("eliminarDelCarrito quita solo el producto indicado", () => {
  agregarAlCarrito(guitarra);
  const carritoConDos = agregarAlCarrito(cable);

  const carrito = eliminarDelCarrito(carritoConDos, 1);

  expect(carrito.map((item) => item.id)).toEqual([7]);
  expect(obtenerCarrito().map((item) => item.id)).toEqual([7]);
});

test("eliminar un producto que no está en el carrito no cambia nada", () => {
  const carrito = agregarAlCarrito(guitarra);

  expect(eliminarDelCarrito(carrito, 999)).toEqual(carrito);
});

test("vaciarCarrito deja el carrito sin productos, también en localStorage", () => {
  agregarAlCarrito(guitarra);
  agregarAlCarrito(cable);

  expect(vaciarCarrito()).toEqual([]);
  expect(obtenerCarrito()).toEqual([]);
});

test("calcularTotalCarrito es 0 con el carrito vacío", () => {
  expect(calcularTotalCarrito([])).toBe(0);
});

test("calcularTotalCarrito suma precio por cantidad de cada línea", () => {
  guardarCarrito([
    { id: 1, nombre: "Guitarra", precio: 189990, icono: "🎸", cantidad: 2 },
    { id: 7, nombre: "Cable", precio: 8990, icono: "🔌", cantidad: 3 },
  ]);

  expect(calcularTotalCarrito(obtenerCarrito())).toBe(189990 * 2 + 8990 * 3);
});

test("formatearPrecioCLP usa el formato $XXX.XXX", () => {
  expect(formatearPrecioCLP(189990)).toBe("$189.990");
  expect(formatearPrecioCLP(1234567)).toBe("$1.234.567");
  expect(formatearPrecioCLP(8990)).toBe("$8.990");
  expect(formatearPrecioCLP(0)).toBe("$0");
});
