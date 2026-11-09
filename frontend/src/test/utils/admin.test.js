import { afterEach, expect, test, vi } from "vitest";
import { Variables } from "../../config/variables";
import { peticionAutenticada } from "../../service/http";
import { erroresDeServidor } from "../../utils/erroresServidor";
import { validarPersonal } from "../../utils/validacionPersonal";
import { validarProducto } from "../../utils/validacionProducto";

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

const productoValido = { codigo: "AC050", marca: "", modelo: "", descripcion: "", nombre: "Cuerdas Elixir", categoria: "Accesorios", precio: "15990", stock: "0", icono: "🎼" };
const personalValido = { nombre: "Vera Vendedora", correo: "vera@sonidovivo.cl", rut: "12.345.678-5", telefono: "", clave: "clave1234", perfil: "vendedor" };

test("validarProducto acepta datos válidos y stock 0", () => {
  expect(validarProducto(productoValido)).toEqual({});
});

test("validarProducto rechaza nombre corto, categoría ajena, precio y stock inválidos e icono vacío", () => {
  expect(validarProducto({ ...productoValido, codigo: "ab" }).codigo).toBeTruthy();
  expect(validarProducto({ ...productoValido, nombre: "ab" }).nombre).toBeTruthy();
  expect(validarProducto({ ...productoValido, descripcion: "x".repeat(501) }).descripcion).toBeTruthy();
  expect(validarProducto({ ...productoValido, categoria: "Otra" }).categoria).toBeTruthy();
  for (const precio of ["", "0", "-5", "10.5", "abc"]) {
    expect(validarProducto({ ...productoValido, precio }).precio).toBeTruthy();
  }
  for (const stock of ["", "-1", "2.5"]) {
    expect(validarProducto({ ...productoValido, stock }).stock).toBeTruthy();
  }
  expect(validarProducto({ ...productoValido, icono: "  " }).icono).toBeTruthy();
});

test("validarPersonal exige RUT válido, contraseña segura y un perfil permitido", () => {
  expect(validarPersonal(personalValido)).toEqual({});
  expect(validarPersonal({ ...personalValido, rut: "12.345.678-9" }).rut).toBeTruthy();
  expect(validarPersonal({ ...personalValido, clave: "corta" }).clave).toBeTruthy();
  expect(validarPersonal({ ...personalValido, perfil: "cliente" }).perfil).toBeTruthy();
  expect(validarPersonal({ ...personalValido, telefono: "123" }).telefono).toBeTruthy();
});

test("peticionAutenticada envía el token y el cuerpo JSON", async () => {
  localStorage.setItem(Variables.tokenKey, "t0k3n");
  const fetchFalso = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: 1 }) }));
  vi.stubGlobal("fetch", fetchFalso);

  await peticionAutenticada("http://x/api", { metodo: "POST", cuerpo: { a: 1 } });

  const [, opciones] = fetchFalso.mock.calls[0];
  expect(opciones.method).toBe("POST");
  expect(opciones.headers.Authorization).toBe("Bearer t0k3n");
  expect(opciones.headers["Content-Type"]).toBe("application/json");
  expect(JSON.parse(opciones.body)).toEqual({ a: 1 });
});

test("peticionAutenticada no falla con respuestas 204 sin cuerpo", async () => {
  vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: true, status: 204, json: () => Promise.reject(new Error("vacío")) })));

  await expect(peticionAutenticada("http://x/api", { metodo: "DELETE" })).resolves.toEqual({});
});

test("peticionAutenticada conserva estado, campo y errores del backend", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: false, status: 409, json: () => Promise.resolve({ mensaje: "Duplicado", campo: "rut" }) }))
  );

  await expect(peticionAutenticada("http://x/api")).rejects.toMatchObject({ message: "Duplicado", status: 409, campo: "rut" });
});

test("peticionAutenticada informa si no hay conexión", async () => {
  vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("fail"))));

  await expect(peticionAutenticada("http://x/api")).rejects.toThrow("No se pudo conectar con el servicio.");
});

test("erroresDeServidor reparte errores por campo o los deja como mensaje general", () => {
  expect(erroresDeServidor({ errores: { nombre: "mal" }, message: "x" }, ["nombre"])).toEqual({ campos: { nombre: "mal" }, general: "" });
  expect(erroresDeServidor({ campo: "rut", message: "dup" }, ["rut"])).toEqual({ campos: { rut: "dup" }, general: "" });
  expect(erroresDeServidor({ campo: "otro", message: "dup" }, ["rut"])).toEqual({ campos: {}, general: "dup" });
  expect(erroresDeServidor({ message: "caído" }, ["rut"])).toEqual({ campos: {}, general: "caído" });
});
