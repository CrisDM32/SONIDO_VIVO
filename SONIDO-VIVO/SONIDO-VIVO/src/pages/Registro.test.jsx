import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import Registro from "./Registro";
import { validarRegistro } from "../utils/validacionRegistro";

afterEach(cleanup);

const formValido = {
  nombre: "Ana Pérez",
  email: "ana@correo.cl",
  telefono: "+56 9 1234 5678",
  password: "clave1234",
  password2: "clave1234",
  terminos: true,
};

test("el formulario de registro se renderiza correctamente", () => {
  render(<Registro />);

  expect(screen.getByRole("textbox", { name: "Nombre completo *" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Correo electrónico *" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Teléfono" })).toBeTruthy();
  expect(screen.getByLabelText("Contraseña *")).toBeTruthy();
  expect(screen.getByLabelText("Repetir contraseña *")).toBeTruthy();
  expect(screen.getByRole("checkbox")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Crear cuenta" })).toBeTruthy();
});

test("al enviar sin completar los campos, se muestran los mensajes de error", async () => {
  const user = userEvent.setup();
  render(<Registro />);

  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

  expect(screen.getByText("Escribe tu nombre completo (mínimo 3 caracteres).")).toBeTruthy();
  expect(screen.getByText("Ingresa un correo electrónico válido.")).toBeTruthy();
  expect(screen.getByText("La contraseña debe tener 8+ caracteres, con letras y números.")).toBeTruthy();
  expect(screen.getByText("Las contraseñas no coinciden.")).toBeTruthy();
  expect(screen.getByText("Debes aceptar los términos y condiciones.")).toBeTruthy();
});

test("confirma un registro válido", async () => {
  const user = userEvent.setup();
  render(<Registro />);

  await user.type(screen.getByLabelText("Nombre completo *"), formValido.nombre);
  await user.type(screen.getByLabelText("Correo electrónico *"), formValido.email);
  await user.type(screen.getByLabelText("Contraseña *"), formValido.password);
  await user.type(screen.getByLabelText("Repetir contraseña *"), formValido.password2);
  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

  expect(screen.getByText(/Cuenta creada correctamente/)).toBeTruthy();
});

test("validarRegistro no devuelve errores con datos válidos", () => {
  expect(validarRegistro(formValido)).toEqual({});
});

test("validarRegistro rechaza un nombre de menos de 3 caracteres", () => {
  expect(validarRegistro({ ...formValido, nombre: " Al " }).nombre).toBeTruthy();
});

test("validarRegistro rechaza correos con formato inválido", () => {
  expect(validarRegistro({ ...formValido, email: "" }).email).toBeTruthy();
  expect(validarRegistro({ ...formValido, email: "ana@correo" }).email).toBeTruthy();
});

test("validarRegistro acepta teléfono vacío pero rechaza uno inválido", () => {
  expect(validarRegistro({ ...formValido, telefono: "" }).telefono).toBeUndefined();
  expect(validarRegistro({ ...formValido, telefono: "12345" }).telefono).toBeTruthy();
  expect(validarRegistro({ ...formValido, telefono: "9123abcd5678" }).telefono).toBeTruthy();
});

test("validarRegistro exige contraseña de 8+ caracteres con letras y números", () => {
  const conPassword = (password) =>
    validarRegistro({ ...formValido, password, password2: password }).password;

  expect(conPassword("abc123")).toBeTruthy();
  expect(conPassword("abcdefgh")).toBeTruthy();
  expect(conPassword("12345678")).toBeTruthy();
  expect(conPassword("clave1234")).toBeUndefined();
});

test("validarRegistro rechaza contraseñas que no coinciden o repetición vacía", () => {
  expect(validarRegistro({ ...formValido, password2: "otra1234" }).password2).toBeTruthy();
  expect(validarRegistro({ ...formValido, password2: "" }).password2).toBeTruthy();
});

test("validarRegistro exige aceptar los términos", () => {
  expect(validarRegistro({ ...formValido, terminos: false }).terminos).toBeTruthy();
});
