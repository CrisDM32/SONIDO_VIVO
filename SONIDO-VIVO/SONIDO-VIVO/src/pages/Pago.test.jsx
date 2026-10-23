import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import Pago from "./Pago";
import { validarEnvio } from "../utils/validacionEnvio";

afterEach(cleanup);

const formValido = {
  nombre: "Ana Pérez",
  rut: "12.345.678-5",
  telefono: "+56 9 1234 5678",
  correo: "ana@correo.cl",
  direccion: "Av. Providencia 1234",
  region: "Región Metropolitana",
  comuna: "Santiago",
};

test("el formulario de envío se renderiza correctamente", () => {
  render(<Pago />);

  expect(screen.getByRole("textbox", { name: "Nombre completo" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "RUT" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Teléfono" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Correo electrónico" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Dirección" })).toBeTruthy();
  expect(screen.getByRole("combobox", { name: "Región" })).toBeTruthy();
  expect(screen.getByRole("combobox", { name: "Comuna" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Continuar" })).toBeTruthy();
});

test("al enviar sin completar los campos, se muestran los mensajes de error", async () => {
  const user = userEvent.setup();
  render(<Pago />);

  await user.click(screen.getByRole("button", { name: "Continuar" }));

  expect(screen.getByText("Escribe tu nombre completo (mínimo 3 caracteres).")).toBeTruthy();
  expect(screen.getByText("Ingresa un RUT válido (ej: 12.345.678-5).")).toBeTruthy();
  expect(screen.getByText("Ingresa un teléfono válido (mínimo 8 dígitos).")).toBeTruthy();
  expect(screen.getByText("Ingresa un correo electrónico válido.")).toBeTruthy();
  expect(screen.getByText("Escribe tu dirección (calle y número).")).toBeTruthy();
});

test("al cambiar la región se actualizan las comunas disponibles", async () => {
  const user = userEvent.setup();
  render(<Pago />);

  await user.selectOptions(screen.getByRole("combobox", { name: "Región" }), "Región de Valparaíso");

  expect(screen.getByRole("combobox", { name: "Comuna" }).value).toBe("Valparaíso");
  expect(screen.getByRole("option", { name: "Viña del Mar" })).toBeTruthy();
  expect(screen.queryByRole("option", { name: "Santiago" })).toBeNull();
});

test("validarEnvio no devuelve errores con datos válidos", () => {
  expect(validarEnvio(formValido)).toEqual({});
});

test("validarEnvio rechaza un nombre de menos de 3 caracteres", () => {
  expect(validarEnvio({ ...formValido, nombre: " Al " }).nombre).toBeTruthy();
});

test("validarEnvio valida el formato y el dígito verificador del RUT", () => {
  expect(validarEnvio({ ...formValido, rut: "" }).rut).toBeTruthy();
  expect(validarEnvio({ ...formValido, rut: "12.345.678-0" }).rut).toBeTruthy();
  expect(validarEnvio({ ...formValido, rut: "abc" }).rut).toBeTruthy();
  expect(validarEnvio({ ...formValido, rut: "12345678-5" }).rut).toBeUndefined();
});

test("validarEnvio rechaza teléfonos con letras o con menos de 8 dígitos", () => {
  expect(validarEnvio({ ...formValido, telefono: "" }).telefono).toBeTruthy();
  expect(validarEnvio({ ...formValido, telefono: "12345" }).telefono).toBeTruthy();
  expect(validarEnvio({ ...formValido, telefono: "9123abcd5678" }).telefono).toBeTruthy();
});

test("validarEnvio rechaza correos con formato inválido", () => {
  expect(validarEnvio({ ...formValido, correo: "" }).correo).toBeTruthy();
  expect(validarEnvio({ ...formValido, correo: "ana@correo" }).correo).toBeTruthy();
});

test("validarEnvio rechaza una dirección demasiado corta", () => {
  expect(validarEnvio({ ...formValido, direccion: "  Ab " }).direccion).toBeTruthy();
});

test("validarEnvio rechaza regiones inexistentes y comunas que no pertenecen a la región", () => {
  expect(validarEnvio({ ...formValido, region: "" }).region).toBeTruthy();
  expect(validarEnvio({ ...formValido, comuna: "Valparaíso" }).comuna).toBeTruthy();
});
