import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import Contacto from "./Contacto";
import { validarContacto } from "../utils/validacionContacto";

afterEach(cleanup);

const formValido = {
  nombre: "Ana Pérez",
  telefono: "+56 9 1234 5678",
  correo: "ana@correo.cl",
  motivo: "Quiero cotizar una guitarra eléctrica",
};

test("el formulario de contacto se renderiza correctamente", () => {
  render(<Contacto />);

  expect(screen.getByRole("textbox", { name: "Nombre completo" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Teléfono" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Correo electrónico" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Motivo de contacto" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Enviar" })).toBeTruthy();
});

test("al enviar sin completar los campos, se muestran los mensajes de error", async () => {
  const user = userEvent.setup();
  render(<Contacto />);

  await user.click(screen.getByRole("button", { name: "Enviar" }));

  expect(screen.getByText("Escribe tu nombre completo (mínimo 3 caracteres).")).toBeTruthy();
  expect(screen.getByText("Ingresa un teléfono válido (mínimo 8 dígitos).")).toBeTruthy();
  expect(screen.getByText("Ingresa un correo electrónico válido.")).toBeTruthy();
  expect(screen.getByText("Describe el motivo de tu consulta (mínimo 10 caracteres).")).toBeTruthy();
});

test("confirma un contacto válido", async () => {
  const user = userEvent.setup();
  render(<Contacto />);

  await user.type(screen.getByLabelText("Nombre completo"), formValido.nombre);
  await user.type(screen.getByLabelText("Teléfono"), formValido.telefono);
  await user.type(screen.getByLabelText("Correo electrónico"), formValido.correo);
  await user.type(screen.getByLabelText("Motivo de contacto"), formValido.motivo);
  await user.click(screen.getByRole("button", { name: "Enviar" }));

  expect(screen.getByText(/Mensaje enviado/)).toBeTruthy();
  expect(screen.queryByText("Ingresa un correo electrónico válido.")).toBeNull();
});

test("validarContacto no devuelve errores con datos válidos", () => {
  expect(validarContacto(formValido)).toEqual({});
});

test("validarContacto rechaza un nombre de menos de 3 caracteres", () => {
  const errores = validarContacto({ ...formValido, nombre: "Al" });
  expect(errores.nombre).toBeTruthy();
});

test("validarContacto rechaza teléfonos con letras o con menos de 8 dígitos", () => {
  expect(validarContacto({ ...formValido, telefono: "" }).telefono).toBeTruthy();
  expect(validarContacto({ ...formValido, telefono: "12345" }).telefono).toBeTruthy();
  expect(validarContacto({ ...formValido, telefono: "9123abcd5678" }).telefono).toBeTruthy();
});

test("validarContacto rechaza correos con formato inválido", () => {
  expect(validarContacto({ ...formValido, correo: "" }).correo).toBeTruthy();
  expect(validarContacto({ ...formValido, correo: "ana@correo" }).correo).toBeTruthy();
  expect(validarContacto({ ...formValido, correo: "ana correo.cl" }).correo).toBeTruthy();
});

test("validarContacto rechaza un motivo vacío o demasiado corto", () => {
  expect(validarContacto({ ...formValido, motivo: "" }).motivo).toBeTruthy();
  expect(validarContacto({ ...formValido, motivo: "corto" }).motivo).toBeTruthy();
});
