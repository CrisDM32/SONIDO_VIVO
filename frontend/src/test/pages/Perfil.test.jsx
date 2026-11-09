import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import App from "../../App";
import { Variables } from "../../config/variables";
import { crearToken } from "../helpers/token";

const correo = "admin@sonidovivo.cl";
const pedidoGuardado = {
  numero: "SV-12345",
  fecha: "08-11-2026 20:15:00",
  items: [{ id: 1, nombre: "Guitarra", precio: 100000, icono: "🎸", cantidad: 2 }],
  total: 200000,
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }))
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
  window.history.pushState({}, "", "/");
});

function abrirPerfil({ sesion = true } = {}) {
  if (sesion) localStorage.setItem(Variables.tokenKey, crearToken());
  window.history.pushState({}, "", "/perfil");
  render(<App />);
}

test("sin sesión redirige al inicio de sesión", () => {
  abrirPerfil({ sesion: false });

  expect(window.location.pathname).toBe("/iniciar-sesion");
  expect(screen.getByRole("heading", { level: 1, name: "Iniciar sesión" })).toBeTruthy();
});

test("muestra los datos de la cuenta", () => {
  abrirPerfil();

  expect(screen.getByRole("heading", { level: 1, name: "Mi perfil" })).toBeTruthy();
  const cuenta = within(screen.getByRole("region", { name: "José Pérez" }));
  expect(cuenta.getByText(correo)).toBeTruthy();
  expect(cuenta.getByText("administrador")).toBeTruthy();
});

test("el menú de cuenta del encabezado enlaza al perfil", () => {
  localStorage.setItem(Variables.tokenKey, crearToken());
  render(<App />);

  const enlace = within(screen.getByRole("banner")).getByRole("link", { name: "Mi perfil" });
  expect(enlace.getAttribute("href")).toBe("/perfil");
});

test("el icono de usuario lleva al perfil con sesión y al inicio de sesión sin ella", () => {
  render(<App />);
  expect(within(screen.getByRole("banner")).getByRole("link", { name: "Cuenta" }).getAttribute("href")).toBe("/iniciar-sesion");

  cleanup();
  localStorage.setItem(Variables.tokenKey, crearToken());
  render(<App />);
  expect(within(screen.getByRole("banner")).getByRole("link", { name: "Cuenta" }).getAttribute("href")).toBe("/perfil");
});

test("sin pedidos muestra un mensaje con enlace al catálogo", () => {
  abrirPerfil();

  expect(screen.getByText(/Aún no tienes pedidos/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "Ver catálogo" }).getAttribute("href")).toBe("/productos");
});

test("lista los pedidos anteriores del usuario, con su detalle", () => {
  localStorage.setItem(`sv_pedidos_${correo}`, JSON.stringify([pedidoGuardado]));
  localStorage.setItem("sv_pedidos_otra@correo.cl", JSON.stringify([{ ...pedidoGuardado, numero: "SV-99999" }]));
  abrirPerfil();

  const historial = within(screen.getByRole("region", { name: "Mis pedidos" }));
  expect(historial.getByText("SV-12345", { selector: "summary span" })).toBeTruthy();
  expect(historial.queryByText("SV-99999", { selector: "summary span" })).toBeNull();
  expect(historial.getByText("$200.000", { selector: "summary span" })).toBeTruthy();
  expect(historial.getByText(/Guitarra x2/)).toBeTruthy();
});

test("guarda teléfono y dirección, y se conservan al volver", async () => {
  const user = userEvent.setup();
  abrirPerfil();

  await user.type(screen.getByLabelText("Teléfono"), "+56 9 1234 5678");
  await user.type(screen.getByLabelText("Dirección"), "Av. Siempre Viva 742");
  await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

  expect(screen.getByRole("status").textContent).toContain("se guardaron");
  expect(JSON.parse(localStorage.getItem(`sv_perfil_${correo}`)).direccion).toBe("Av. Siempre Viva 742");

  cleanup();
  render(<App />);
  expect(screen.getByLabelText("Dirección").value).toBe("Av. Siempre Viva 742");
});

test("con datos inválidos muestra errores y no guarda", async () => {
  const user = userEvent.setup();
  abrirPerfil();

  await user.type(screen.getByLabelText("Teléfono"), "123");
  await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

  expect(screen.getByText("Ingresa un teléfono válido (mínimo 8 dígitos).")).toBeTruthy();
  expect(localStorage.getItem(`sv_perfil_${correo}`)).toBeNull();
});

test("el botón Cerrar sesión del perfil termina la sesión y vuelve al inicio", async () => {
  const user = userEvent.setup();
  abrirPerfil();

  await user.click(within(screen.getByRole("region", { name: "José Pérez" })).getByRole("button", { name: "Cerrar sesión" }));

  expect(window.location.pathname).toBe("/");
  expect(localStorage.getItem(Variables.tokenKey)).toBeNull();
  expect(screen.queryByText(/^Hola,/)).toBeNull();
});

test("la dirección guardada precarga el formulario de envío", () => {
  localStorage.setItem(`sv_perfil_${correo}`, JSON.stringify({ telefono: "+56 9 1234 5678", direccion: "Calle 123", region: "Región Metropolitana", comuna: "Maipú" }));
  localStorage.setItem(Variables.tokenKey, crearToken());
  window.history.pushState({}, "", "/pago");
  render(<App />);

  expect(screen.getByLabelText("Nombre completo").value).toBe("José Pérez");
  expect(screen.getByLabelText("Correo electrónico").value).toBe(correo);
  expect(screen.getByLabelText("Dirección").value).toBe("Calle 123");
  expect(screen.getByLabelText("Comuna").value).toBe("Maipú");
});

test("una compra con sesión iniciada queda en el historial del perfil", () => {
  localStorage.setItem(Variables.tokenKey, crearToken());
  localStorage.setItem(
    "sv_carrito",
    JSON.stringify([{ id: 1, nombre: "Guitarra", precio: 100000, icono: "🎸", cantidad: 1 }])
  );
  window.history.pushState({}, "", "/pago-tarjeta");
  render(<App />);

  fireEvent.change(screen.getByLabelText("Nombre del titular"), { target: { value: "Ana Pérez" } });
  fireEvent.change(screen.getByLabelText("Número de tarjeta"), { target: { value: "1234 5678 9012 3456" } });
  fireEvent.change(screen.getByLabelText("Fecha de vencimiento"), { target: { value: "2030-05" } });
  fireEvent.change(screen.getByLabelText("CCV"), { target: { value: "123" } });
  fireEvent.click(screen.getByRole("button", { name: /^Pagar/ }));

  expect(window.location.pathname).toBe("/resumen");
  const pedidos = JSON.parse(localStorage.getItem(`sv_pedidos_${correo}`));
  expect(pedidos).toHaveLength(1);
  expect(pedidos[0].total).toBe(100000);
});
