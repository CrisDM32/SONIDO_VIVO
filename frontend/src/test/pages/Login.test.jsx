import { MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Login from "../../pages/Login";
import App from "../../App";
import { validarLogin } from "../../utils/validacionLogin";
import { Variables } from "../../config/variables";
import { crearToken } from "../helpers/token";

function respuesta(ok, cuerpo) {
  return Promise.resolve({ ok, json: () => Promise.resolve(cuerpo) });
}

function stubFetch(loginRespuesta) {
  const fetchFalso = vi.fn((url) => (String(url).endsWith("/auth/login") ? loginRespuesta() : respuesta(true, [])));
  vi.stubGlobal("fetch", fetchFalso);
  return fetchFalso;
}

beforeEach(() => stubFetch(() => respuesta(false, { mensaje: "Correo o clave incorrectos" })));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
  window.history.pushState({}, "", "/");
});

const formValido = {
  email: "ana@correo.cl",
  password: "clave123",
};

test("el formulario de inicio de sesión se renderiza correctamente", () => {
  render(<MemoryRouter><Login /></MemoryRouter>);

  expect(screen.getByRole("textbox", { name: "Correo electrónico" })).toBeTruthy();
  expect(screen.getByLabelText("Contraseña")).toBeTruthy();
  expect(screen.getByRole("link", { name: "¿Olvidaste tu contraseña?" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeTruthy();
});

test("al enviar sin completar los campos, se muestran los mensajes de error", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><Login /></MemoryRouter>);

  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));

  expect(screen.getByText("Ingresa un correo electrónico válido.")).toBeTruthy();
  expect(screen.getByText("Ingresa tu contraseña.")).toBeTruthy();
});

test("con datos válidos no se muestran errores", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><Login /></MemoryRouter>);

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

async function completarYEnviar(user) {
  await user.type(screen.getByLabelText("Correo electrónico"), "admin@sonidovivo.cl");
  await user.type(screen.getByLabelText("Contraseña"), "admin");
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

test("con credenciales correctas guarda el token, vuelve al inicio y el encabezado muestra el nombre", async () => {
  const user = userEvent.setup();
  const token = crearToken();
  const fetchFalso = stubFetch(() => respuesta(true, { token }));
  window.history.pushState({}, "", "/iniciar-sesion");
  render(<App />);

  await completarYEnviar(user);

  expect(await screen.findByText("Hola, José Pérez")).toBeTruthy();
  expect(window.location.pathname).toBe("/");
  expect(localStorage.getItem(Variables.tokenKey)).toBe(token);

  const llamada = fetchFalso.mock.calls.find(([url]) => String(url).endsWith("/auth/login"));
  expect(JSON.parse(llamada[1].body)).toEqual({ correo: "admin@sonidovivo.cl", clave: "admin" });
});

test("con credenciales incorrectas muestra el mensaje y no guarda ningún token", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/iniciar-sesion");
  render(<App />);

  await completarYEnviar(user);

  expect((await screen.findByRole("alert")).textContent).toBe("Correo o clave incorrectos");
  expect(window.location.pathname).toBe("/iniciar-sesion");
  expect(localStorage.getItem(Variables.tokenKey)).toBeNull();
  expect(screen.queryByText(/^Hola,/)).toBeNull();
});

test("si no hay conexión con el servicio lo informa", async () => {
  const user = userEvent.setup();
  vi.stubGlobal("fetch", vi.fn((url) => (String(url).endsWith("/auth/login") ? Promise.reject(new TypeError("x")) : respuesta(true, []))));
  render(<MemoryRouter><Login /></MemoryRouter>);

  await completarYEnviar(user);

  expect((await screen.findByRole("alert")).textContent).toBe("No se pudo conectar con el servicio.");
});

test("mientras se envía el botón queda deshabilitado y evita un segundo envío", async () => {
  const user = userEvent.setup();
  let terminar;
  const fetchFalso = stubFetch(() => new Promise((resolver) => { terminar = () => resolver({ ok: false, json: () => Promise.resolve({ mensaje: "Correo o clave incorrectos" }) }); }));
  render(<MemoryRouter><Login /></MemoryRouter>);

  await completarYEnviar(user);

  const boton = screen.getByRole("button", { name: "Ingresando…" });
  expect(boton.disabled).toBe(true);
  expect(fetchFalso.mock.calls.filter(([url]) => String(url).endsWith("/auth/login"))).toHaveLength(1);

  terminar();
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Iniciar sesión" }).disabled).toBe(false);
});

test("con una sesión guardada, el encabezado permite cerrarla", async () => {
  const user = userEvent.setup();
  localStorage.setItem(Variables.tokenKey, crearToken());
  window.history.pushState({}, "", "/");
  render(<App />);

  expect(screen.getByText("Hola, José Pérez")).toBeTruthy();
  expect(within(screen.getByRole("banner")).queryByRole("link", { name: "Iniciar Sesión" })).toBeNull();

  await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));

  expect(screen.queryByText(/^Hola,/)).toBeNull();
  expect(within(screen.getByRole("banner")).getByRole("link", { name: "Iniciar Sesión" })).toBeTruthy();
  expect(localStorage.getItem(Variables.tokenKey)).toBeNull();
});

test("un token vencido guardado se descarta al abrir la página", () => {
  localStorage.setItem(Variables.tokenKey, crearToken({}, { vencido: true }));
  render(<App />);

  expect(screen.queryByText(/^Hola,/)).toBeNull();
  expect(within(screen.getByRole("banner")).getByRole("link", { name: "Iniciar Sesión" })).toBeTruthy();
  expect(localStorage.getItem(Variables.tokenKey)).toBeNull();
});
