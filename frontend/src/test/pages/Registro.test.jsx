import { MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import App from "../../App";
import Registro from "../../pages/Registro";
import { validarRegistro } from "../../utils/validacionRegistro";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
  window.history.pushState({}, "", "/");
});

function respuesta(estado, cuerpo) {
  return Promise.resolve({ ok: estado < 400, status: estado, json: () => Promise.resolve(cuerpo) });
}

async function completarFormulario(user) {
  await user.type(screen.getByLabelText("Nombre completo *"), formValido.nombre);
  await user.type(screen.getByLabelText("Correo electrónico *"), formValido.email);
  await user.type(screen.getByLabelText("RUT *"), formValido.rut);
  await user.type(screen.getByLabelText("Contraseña *"), formValido.password);
  await user.type(screen.getByLabelText("Repetir contraseña *"), formValido.password2);
  await user.click(screen.getByRole("checkbox"));
}

const formValido = {
  nombre: "Ana Pérez",
  email: "ana@correo.cl",
  rut: "12.345.678-5",
  telefono: "+56 9 1234 5678",
  password: "clave1234",
  password2: "clave1234",
  terminos: true,
};

test("el formulario de registro se renderiza correctamente", () => {
  render(<MemoryRouter><Registro /></MemoryRouter>);

  expect(screen.getByRole("textbox", { name: "Nombre completo *" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Correo electrónico *" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "RUT *" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Teléfono" })).toBeTruthy();
  expect(screen.getByLabelText("Contraseña *")).toBeTruthy();
  expect(screen.getByLabelText("Repetir contraseña *")).toBeTruthy();
  expect(screen.getByRole("checkbox")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Crear cuenta" })).toBeTruthy();
});

test("al enviar sin completar los campos, se muestran los mensajes de error", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><Registro /></MemoryRouter>);

  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

  expect(screen.getByText("Escribe tu nombre completo (mínimo 3 caracteres).")).toBeTruthy();
  expect(screen.getByText("Ingresa un correo electrónico válido.")).toBeTruthy();
  expect(screen.getByText("Ingresa un RUT válido (ej: 12.345.678-5).")).toBeTruthy();
  expect(screen.getByText("La contraseña debe tener 8+ caracteres, con letras y números.")).toBeTruthy();
  expect(screen.getByText("Las contraseñas no coinciden.")).toBeTruthy();
  expect(screen.getByText("Debes aceptar los términos y condiciones.")).toBeTruthy();
});

test("un registro válido se envía al backend y lleva al inicio de sesión con aviso", async () => {
  fetchMock.mockReturnValue(respuesta(201, { mensaje: "Cuenta creada correctamente" }));
  const user = userEvent.setup();
  window.history.pushState({}, "", "/registro");
  render(<App />);

  await completarFormulario(user);
  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

  await waitFor(() => expect(window.location.pathname).toBe("/iniciar-sesion"));
  expect(screen.getByRole("status").textContent).toContain("Cuenta creada correctamente");
  const [url, opciones] = fetchMock.mock.calls[0];
  expect(url).toMatch(/\/auth\/registro$/);
  expect(JSON.parse(opciones.body)).toEqual({
    nombre: "Ana Pérez",
    correo: "ana@correo.cl",
    rut: "12.345.678-5",
    telefono: "",
    clave: "clave1234",
  });
});

test("un correo ya registrado se muestra bajo el campo correo y no se pierde lo escrito", async () => {
  fetchMock.mockReturnValue(respuesta(409, { mensaje: "Ya existe una cuenta con ese correo", campo: "correo" }));
  const user = userEvent.setup();
  render(<MemoryRouter><Registro /></MemoryRouter>);

  await completarFormulario(user);
  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

  expect(await screen.findByText("Ya existe una cuenta con ese correo")).toBeTruthy();
  expect(screen.getByLabelText("Correo electrónico *").value).toBe("ana@correo.cl");
  expect(screen.getByRole("button", { name: "Crear cuenta" }).disabled).toBe(false);
});

test("un RUT ya registrado se muestra bajo el campo RUT", async () => {
  fetchMock.mockReturnValue(respuesta(409, { mensaje: "Ya existe una cuenta con ese RUT", campo: "rut" }));
  const user = userEvent.setup();
  render(<MemoryRouter><Registro /></MemoryRouter>);

  await completarFormulario(user);
  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

  expect(await screen.findByText("Ya existe una cuenta con ese RUT")).toBeTruthy();
});

test("un fallo de conexión muestra un mensaje general", async () => {
  fetchMock.mockRejectedValue(new TypeError("fail"));
  const user = userEvent.setup();
  render(<MemoryRouter><Registro /></MemoryRouter>);

  await completarFormulario(user);
  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

  expect((await screen.findByRole("alert")).textContent).toBe("No se pudo conectar con el servicio.");
});

test("mientras se envía el botón queda deshabilitado", async () => {
  fetchMock.mockReturnValue(new Promise(() => {}));
  const user = userEvent.setup();
  render(<MemoryRouter><Registro /></MemoryRouter>);

  await completarFormulario(user);
  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

  const boton = await screen.findByRole("button", { name: "Creando cuenta…" });
  expect(boton.disabled).toBe(true);
});

test("validarRegistro exige un RUT válido", () => {
  expect(validarRegistro({ ...formValido, rut: "" }).rut).toBeTruthy();
  expect(validarRegistro({ ...formValido, rut: "12.345.678-9" }).rut).toBeTruthy();
  expect(validarRegistro({ ...formValido, rut: "12345678-5" }).rut).toBeUndefined();
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

test("el checkbox de términos y condiciones tiene tamaño normal (no usa el estilo de los campos de texto)", () => {
  render(<MemoryRouter><Registro /></MemoryRouter>);

  const clases = screen.getByRole("checkbox").className;
  expect(clases).toContain("size-[18px]");
  expect(clases).not.toContain("w-full");
  expect(clases).not.toContain("min-h-");
});
