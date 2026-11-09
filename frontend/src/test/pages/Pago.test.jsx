import { MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test } from "vitest";
import Pago from "../../pages/Pago";
import { validarEnvio } from "../../utils/validacionEnvio";

beforeEach(() => {
  localStorage.setItem(
    "sv_carrito",
    JSON.stringify([{ id: 1, nombre: "Guitarra", precio: 100000, icono: "🎸", cantidad: 1 }])
  );
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

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
  render(<MemoryRouter><Pago /></MemoryRouter>);

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
  render(<MemoryRouter><Pago /></MemoryRouter>);

  await user.click(screen.getByRole("button", { name: "Continuar" }));

  expect(screen.getByText("Escribe tu nombre completo (mínimo 3 caracteres).")).toBeTruthy();
  expect(screen.getByText("Ingresa un RUT válido (ej: 12.345.678-5).")).toBeTruthy();
  expect(screen.getByText("Ingresa un teléfono válido (mínimo 8 dígitos).")).toBeTruthy();
  expect(screen.getByText("Ingresa un correo electrónico válido.")).toBeTruthy();
  expect(screen.getByText("Escribe tu dirección (calle y número).")).toBeTruthy();
});

test("con el carrito vacío no se puede continuar y se invita a agregar productos", async () => {
  const user = userEvent.setup();
  localStorage.clear();
  render(<MemoryRouter><Pago /></MemoryRouter>);

  const continuar = screen.getByRole("button", { name: "Continuar" });
  expect(continuar.disabled).toBe(true);
  expect(screen.getByText(/Agrega productos al carrito antes de continuar/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "Ver catálogo" }).getAttribute("href")).toBe("/productos");

  await user.click(continuar);
  expect(screen.queryByText("Escribe tu nombre completo (mínimo 3 caracteres).")).toBeNull();
});

test("con productos en el carrito el botón Continuar está habilitado", () => {
  render(<MemoryRouter><Pago /></MemoryRouter>);

  expect(screen.getByRole("button", { name: "Continuar" }).disabled).toBe(false);
  expect(screen.queryByText(/Agrega productos al carrito antes de continuar/)).toBeNull();
});

test("al cambiar la región se actualizan las comunas disponibles", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><Pago /></MemoryRouter>);

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
