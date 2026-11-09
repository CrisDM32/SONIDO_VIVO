import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import App from "../App";

// Pruebas del proceso de compra completo, navegando por la app real como lo haría una persona:
// catálogo -> carrito -> datos de envío -> pago con tarjeta -> resumen.

const datosEnvio = {
  "Nombre completo": "Ana Pérez",
  RUT: "12.345.678-5",
  Teléfono: "+56 9 1234 5678",
  "Correo electrónico": "ana@correo.cl",
  Dirección: "Av. Providencia 1234",
};

const datosTarjeta = {
  "Nombre del titular": "Ana Pérez",
  "Número de tarjeta": "1234 5678 9012 3456",
  CCV: "123",
};

const itemsCarrito = [
  { id: 1, nombre: "Guitarra Acústica Yamaha", precio: 189990, icono: "🎸", cantidad: 2 },
  { id: 7, nombre: "Cable de instrumento 3 metros", precio: 8990, icono: "🔌", cantidad: 1 },
];

function abrir(ruta) {
  window.history.pushState({}, "", ruta);
  return render(<App />);
}

const carritoGuardado = () => JSON.parse(localStorage.getItem("sv_carrito") || "[]");
const botonDe = (nombre) =>
  screen.getByRole("heading", { name: nombre }).closest("article").querySelector("button");

async function completarEnvio(user, sobrescribir = {}) {
  for (const [etiqueta, valor] of Object.entries({ ...datosEnvio, ...sobrescribir })) {
    await user.type(screen.getByRole("textbox", { name: etiqueta }), valor);
  }
}

async function completarTarjeta(user, sobrescribir = {}) {
  const datos = { ...datosTarjeta, ...sobrescribir };
  await user.type(screen.getByRole("textbox", { name: "Nombre del titular" }), datos["Nombre del titular"]);
  await user.type(screen.getByRole("textbox", { name: "Número de tarjeta" }), datos["Número de tarjeta"]);
  // el campo "month" no admite escritura con teclado en jsdom: se cambia el valor directamente
  fireEvent.change(screen.getByLabelText("Fecha de vencimiento"), {
    target: { value: sobrescribir.vencimiento ?? "2028-05" },
  });
  await user.type(screen.getByLabelText("CCV"), datos.CCV);
}

beforeEach(() => {
  localStorage.clear();
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

test("compra completa: catálogo, carrito, envío, pago con tarjeta y resumen", async () => {
  const user = userEvent.setup();
  abrir("/productos");
  await screen.findAllByRole("article");

  // 1) Agregar productos desde el catálogo
  await user.click(botonDe("Guitarra Acústica Yamaha"));
  await user.click(botonDe("Cable de instrumento 3 metros"));
  expect(carritoGuardado().map((item) => item.id)).toEqual([1, 7]);

  // 2) Ir al carrito (ícono del encabezado) y subir la cantidad de la guitarra a 2
  await user.click(screen.getByRole("link", { name: "Carrito de compras" }));
  expect(window.location.pathname).toBe("/carrito");
  await user.click(screen.getByRole("button", { name: "Aumentar cantidad de Guitarra Acústica Yamaha" }));
  // total = 189.990 x 2 + 8.990
  expect(screen.getAllByText("$388.970").length).toBeGreaterThan(0);

  // 3) Ir a pagar y completar los datos de envío
  await user.click(screen.getByRole("link", { name: "Ir a pagar" }));
  expect(window.location.pathname).toBe("/pago");
  expect(screen.getByRole("heading", { name: "Resumen del pedido" })).toBeTruthy();
  await completarEnvio(user);
  await user.click(screen.getByRole("button", { name: "Continuar" }));

  // 4) Pagar con tarjeta
  expect(window.location.pathname).toBe("/pago-tarjeta");
  await completarTarjeta(user);
  await user.click(screen.getByRole("button", { name: "Pagar $388.970" }));

  // 5) Resumen del pedido
  expect(window.location.pathname).toBe("/resumen");
  expect(screen.getByRole("heading", { name: "¡Gracias por tu compra!" })).toBeTruthy();
  const detalle = within(screen.getByRole("region", { name: "Detalle del pedido" }));
  expect(detalle.getByText(/SV-\d{5}/)).toBeTruthy();
  expect(detalle.getByText(/Guitarra Acústica Yamaha x2/)).toBeTruthy();
  expect(detalle.getByText(/Cable de instrumento 3 metros x1/)).toBeTruthy();
  expect(detalle.getByText("$388.970")).toBeTruthy();

  // el pedido queda guardado y el carrito se vacía
  const pedido = JSON.parse(localStorage.getItem("sv_ultimo_pedido"));
  expect(pedido.total).toBe(388970);
  expect(pedido.items).toHaveLength(2);
  expect(carritoGuardado()).toEqual([]);
});

test("tras comprar, 'Seguir comprando' lleva al catálogo y el carrito está vacío", async () => {
  const user = userEvent.setup();
  localStorage.setItem("sv_carrito", JSON.stringify(itemsCarrito));
  abrir("/pago-tarjeta");

  await completarTarjeta(user);
  await user.click(screen.getByRole("button", { name: /Pagar/ }));
  await user.click(screen.getByRole("link", { name: "Seguir comprando" }));
  expect(window.location.pathname).toBe("/productos");

  await user.click(screen.getByRole("link", { name: "Carrito de compras" }));
  expect(screen.getByText(/Tu carrito está vacío/)).toBeTruthy();
});

test("con datos de envío inválidos no se avanza al pago y se muestran los errores", async () => {
  const user = userEvent.setup();
  localStorage.setItem("sv_carrito", JSON.stringify(itemsCarrito));
  abrir("/pago");

  await completarEnvio(user, { RUT: "12.345.678-0", "Correo electrónico": "ana@correo" });
  await user.click(screen.getByRole("button", { name: "Continuar" }));

  expect(window.location.pathname).toBe("/pago");
  expect(screen.getByText("Ingresa un RUT válido (ej: 12.345.678-5).")).toBeTruthy();
  expect(screen.getByText("Ingresa un correo electrónico válido.")).toBeTruthy();
  expect(carritoGuardado()).toHaveLength(2);
});

test("el resumen del pedido en /pago muestra los productos y el total a pagar", () => {
  localStorage.setItem("sv_carrito", JSON.stringify(itemsCarrito));
  abrir("/pago");

  const resumen = within(screen.getByRole("complementary"));
  expect(resumen.getByText(/Guitarra Acústica Yamaha x2/)).toBeTruthy();
  expect(resumen.getByText(/Cable de instrumento 3 metros x1/)).toBeTruthy();
  expect(resumen.getByText("$388.970")).toBeTruthy();
});

test("con una tarjeta inválida no se paga: el carrito se conserva y no se crea el pedido", async () => {
  const user = userEvent.setup();
  localStorage.setItem("sv_carrito", JSON.stringify(itemsCarrito));
  abrir("/pago-tarjeta");

  await completarTarjeta(user, { "Número de tarjeta": "1234", vencimiento: "2020-01", CCV: "12" });
  await user.click(screen.getByRole("button", { name: /Pagar/ }));

  expect(window.location.pathname).toBe("/pago-tarjeta");
  expect(screen.getByText("Ingresa un número de tarjeta válido (13 a 19 dígitos).")).toBeTruthy();
  expect(screen.getByText("La tarjeta está vencida.")).toBeTruthy();
  expect(screen.getByText("El CCV debe tener 3 o 4 dígitos.")).toBeTruthy();
  expect(carritoGuardado()).toHaveLength(2);
  expect(localStorage.getItem("sv_ultimo_pedido")).toBeNull();
});

test("en /pago-tarjeta con el carrito vacío no se puede pagar", () => {
  abrir("/pago-tarjeta");

  expect(screen.getByRole("button", { name: /Pagar/ }).disabled).toBe(true);
  expect(screen.getByText(/Agrega productos al carrito antes de pagar/)).toBeTruthy();
});

test("sin ningún pedido realizado, /resumen muestra 'Sin pedidos recientes'", () => {
  abrir("/resumen");

  expect(screen.getByRole("heading", { name: "Sin pedidos recientes" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Ver catálogo" }).getAttribute("href")).toBe("/productos");
});

test("el carrito se conserva al recargar la página (persiste en localStorage)", async () => {
  const user = userEvent.setup();
  abrir("/productos");
  await screen.findAllByRole("article");
  await user.click(botonDe("Teclado Yamaha PSR"));

  cleanup();
  abrir("/carrito");

  expect(screen.getByRole("heading", { name: "Teclado Yamaha PSR" })).toBeTruthy();
});

test("con el carrito vacío, /pago no permite continuar y ofrece volver al catálogo", async () => {
  const user = userEvent.setup();
  abrir("/pago");

  expect(screen.getByText("Tu carrito está vacío.")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Continuar" }).disabled).toBe(true);

  await completarEnvio(user);
  await user.click(screen.getByRole("button", { name: "Continuar" }));

  expect(window.location.pathname).toBe("/pago");

  await user.click(screen.getByRole("link", { name: "Ver catálogo" }));
  expect(window.location.pathname).toBe("/productos");
});
