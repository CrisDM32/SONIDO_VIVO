import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import App from "../../App";
import { productosApi, stubCatalogo } from "../helpers/catalogo";

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, "", "/");
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
  window.history.pushState({}, "", "/");
});

const carrusel = () => within(document.getElementById("product-list"));
const nombresDelCarrusel = () => carrusel().getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
const destacadosEjemplo = productosApi.filter((p) => p.destacado);

test("el carrusel del inicio muestra solo los productos destacados", async () => {
  stubCatalogo();
  render(<App />);

  await screen.findByText("Productos Destacados");
  expect(destacadosEjemplo.length).toBeGreaterThan(0);
  expect(destacadosEjemplo.length).toBeLessThan(productosApi.length);
  expect(nombresDelCarrusel()).toEqual(destacadosEjemplo.map((p) => p.nombre));
  expect(carrusel().queryByText("Micrófono Shure SM58")).toBeNull();
});

test("no hay tope artificial: se muestran todos los destacados, sean los que sean", async () => {
  stubCatalogo(Array.from({ length: 20 }, (_, i) => ({ ...productosApi[0], id: i + 1, nombre: `Destacado ${i + 1}`, destacado: true })));
  render(<App />);

  await screen.findByText("Productos Destacados");
  expect(carrusel().getAllByRole("article")).toHaveLength(20);
});

test("un producto marcado en el panel aparece en el carrusel", async () => {
  stubCatalogo(productosApi.map((p) => (p.id === 6 ? { ...p, destacado: true } : p)));
  render(<App />);

  await screen.findByText("Productos Destacados");
  expect(nombresDelCarrusel()).toContain("Micrófono Shure SM58");
});

test("sin ningún destacado la sección del carrusel no se muestra", async () => {
  stubCatalogo(productosApi.map((p) => ({ ...p, destacado: false })));
  render(<App />);

  await waitFor(() => expect(fetch).toHaveBeenCalled());
  await new Promise((resolver) => setTimeout(resolver, 50));
  expect(screen.queryByText("Productos Destacados")).toBeNull();
  expect(document.getElementById("product-list")).toBeNull();
});

test("un destacado agotado se ve deshabilitado y uno disponible se agrega al carrito", async () => {
  const user = userEvent.setup();
  stubCatalogo();
  render(<App />);
  await screen.findByText("Productos Destacados");

  const agotado = carrusel().getByRole("button", { name: "Agotado" });
  expect(agotado.disabled).toBe(true);

  const tarjeta = carrusel().getByRole("heading", { name: "Guitarra Acústica Yamaha" }).closest("article");
  await user.click(within(tarjeta).getByRole("button", { name: "Añadir al carrito" }));

  expect(JSON.parse(localStorage.getItem("sv_carrito"))).toEqual([
    { id: 1, nombre: "Guitarra Acústica Yamaha", precio: 189990, icono: "🎸", cantidad: 1 },
  ]);
});

test("si el backend falla se avisa en el carrusel", async () => {
  vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("fail"))));
  render(<App />);

  expect((await screen.findByRole("alert")).textContent).toBe("No se han cargado los productos");
});
