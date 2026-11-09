import { afterEach, expect, test } from "vitest";
import { borrarToken, guardarToken, leerToken, usuarioDesdeToken } from "../../utils/token";
import { Variables } from "../../config/variables";
import { crearToken } from "../helpers/token";

afterEach(() => localStorage.clear());

test("usuarioDesdeToken devuelve nombre, correo y perfil (con tildes)", () => {
  expect(usuarioDesdeToken(crearToken())).toEqual({
    nombre: "José Pérez",
    correo: "admin@sonidovivo.cl",
    perfil: "administrador",
  });
});

test("usuarioDesdeToken rechaza tokens vencidos, malformados, vacíos o incompletos", () => {
  expect(usuarioDesdeToken(crearToken({}, { vencido: true }))).toBeNull();
  expect(usuarioDesdeToken("esto-no-es-un-token")).toBeNull();
  expect(usuarioDesdeToken("")).toBeNull();
  expect(usuarioDesdeToken(null)).toBeNull();
  expect(usuarioDesdeToken(crearToken({ nombre: undefined }))).toBeNull();
});

test("guardarToken, leerToken y borrarToken usan localStorage", () => {
  guardarToken("abc");
  expect(localStorage.getItem(Variables.tokenKey)).toBe("abc");
  expect(leerToken()).toBe("abc");

  borrarToken();
  expect(leerToken()).toBeNull();
});
