import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import Login from "./Login";
import { validarLogin } from "../utils/validacionLogin";

afterEach(cleanup);

const formValido = {
  email: "ana@correo.cl",
  password: "clave123",
};

test("el formulario de inicio de sesión se renderiza correctamente", () => {
  render(<Login />);

  expect(screen.getByRole("textbox", { name: "Correo electrónico" })).toBeTruthy();
  expect(screen.getByLabelText("Contraseña")).toBeTruthy();
  expect(screen.getByRole("link", { name: "¿Olvidaste tu contraseña?" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeTruthy();
});

test("al enviar sin completar los campos, se muestran los mensajes de error", async () => {
  const user = userEvent.setup();
  render(<Login />);

  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));

  expect(screen.getByText("Ingresa un correo electrónico válido.")).toBeTruthy();
  expect(screen.getByText("Ingresa tu contraseña.")).toBeTruthy();
});

test("con datos válidos no se muestran errores", async () => {
  const user = userEvent.setup();
  render(<Login />);

  await user.type(screen.getByLabelText("Correo electrónico"), formValido.email);
  await user.type(screen.getByLabelText("Contraseña"), formValido.password);
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));

  expect(screen.queryByText("Ingresa un correo electrónico válido.")).toBeNull();
  expect(screen.queryByText("Ingresa tu contraseña.")).toBeNull();
});

test("validarLogin no devuelve errores con datos válidos", () => {
  expect(validarLogin(formValido)).toEqual({});
});

test("validarLogin rechaza correos vacíos o con formato inválido", () => {
  expect(validarLogin({ ...formValido, email: "" }).email).toBeTruthy();
  expect(validarLogin({ ...formValido, email: "ana@correo" }).email).toBeTruthy();
  expect(validarLogin({ ...formValido, email: "ana correo.cl" }).email).toBeTruthy();
});

test("validarLogin rechaza una contraseña vacía", () => {
  expect(validarLogin({ ...formValido, password: "" }).password).toBeTruthy();
});
