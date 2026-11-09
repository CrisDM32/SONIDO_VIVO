import { afterEach, expect, test } from "vitest";
import { agregarPedido, guardarPerfil, obtenerPedidos, obtenerPerfil } from "../../utils/perfil";
import { validarPerfil } from "../../utils/validacionPerfil";

afterEach(() => localStorage.clear());

const correo = "ana@correo.cl";
const pedido = (numero) => ({ numero, fecha: "01-01-2026", items: [], total: 1000 });

test("obtenerPerfil devuelve valores por defecto y luego lo guardado", () => {
  expect(obtenerPerfil(correo)).toEqual({
    telefono: "",
    direccion: "",
    region: "Región Metropolitana",
    comuna: "Santiago",
  });

  guardarPerfil(correo, { telefono: "+56 9 1234 5678", direccion: "Calle 123", region: "Región Metropolitana", comuna: "Maipú" });

  expect(obtenerPerfil(correo).direccion).toBe("Calle 123");
  expect(obtenerPerfil(correo).comuna).toBe("Maipú");
});

test("el perfil y los pedidos se guardan por separado para cada usuario", () => {
  guardarPerfil(correo, { telefono: "12345678" });
  agregarPedido(correo, pedido("SV-1"));

  expect(obtenerPerfil("otra@correo.cl").telefono).toBe("");
  expect(obtenerPedidos("otra@correo.cl")).toEqual([]);
});

test("agregarPedido deja el pedido más reciente primero", () => {
  agregarPedido(correo, pedido("SV-1"));
  agregarPedido(correo, pedido("SV-2"));

  expect(obtenerPedidos(correo).map((p) => p.numero)).toEqual(["SV-2", "SV-1"]);
});

test("datos guardados corruptos no rompen la lectura", () => {
  localStorage.setItem(`sv_pedidos_${correo}`, "{no es json");
  localStorage.setItem(`sv_perfil_${correo}`, "{no es json");

  expect(obtenerPedidos(correo)).toEqual([]);
  expect(obtenerPerfil(correo).telefono).toBe("");
});

const base = { telefono: "", direccion: "", region: "Región Metropolitana", comuna: "Santiago" };

test("validarPerfil acepta un perfil vacío (los datos son opcionales)", () => {
  expect(validarPerfil(base)).toEqual({});
});

test("validarPerfil rechaza teléfono y dirección inválidos cuando se escriben", () => {
  expect(validarPerfil({ ...base, telefono: "123" }).telefono).toBeTruthy();
  expect(validarPerfil({ ...base, telefono: "abc12345678" }).telefono).toBeTruthy();
  expect(validarPerfil({ ...base, telefono: "+56 9 1234 5678" }).telefono).toBeUndefined();
  expect(validarPerfil({ ...base, direccion: "abc" }).direccion).toBeTruthy();
  expect(validarPerfil({ ...base, direccion: "Calle 123" }).direccion).toBeUndefined();
});

test("validarPerfil exige una región y una comuna coherentes", () => {
  expect(validarPerfil({ ...base, region: "Narnia" }).region).toBeTruthy();
  expect(validarPerfil({ ...base, comuna: "Valparaíso" }).comuna).toBeTruthy();
});
