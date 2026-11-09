import { MemoryRouter } from "react-router-dom";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Garantia from "../../pages/Garantia";
import App from "../../App";
import { garantia } from "../../data/garantia";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }))
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.history.pushState({}, "", "/");
});

test("muestra el título y la introducción de la garantía", () => {
  render(<MemoryRouter><Garantia /></MemoryRouter>);

  expect(screen.getByRole("heading", { level: 1, name: "Garantía" })).toBeTruthy();
  expect(screen.getByText(garantia.introduccion)).toBeTruthy();
});

test("lista lo que cubre y lo que no cubre la garantía", () => {
  render(<MemoryRouter><Garantia /></MemoryRouter>);

  const cubre = screen.getByRole("heading", { name: "¿Qué cubre?" }).closest("section");
  expect(within(cubre).getAllByRole("listitem")).toHaveLength(garantia.cubre.length);
  expect(within(cubre).getByText(garantia.cubre[0])).toBeTruthy();

  const noCubre = screen.getByRole("heading", { name: "¿Qué no cubre?" }).closest("section");
  expect(within(noCubre).getAllByRole("listitem")).toHaveLength(garantia.noCubre.length);
  expect(within(noCubre).getByText(garantia.noCubre[0])).toBeTruthy();
});

test("muestra los pasos para hacer válida la garantía, en orden", () => {
  render(<MemoryRouter><Garantia /></MemoryRouter>);

  const seccion = screen.getByRole("heading", { name: "¿Cómo hacer válida tu garantía?" }).closest("section");
  const pasos = within(seccion).getAllByRole("listitem");

  expect(pasos).toHaveLength(garantia.pasos.length);
  garantia.pasos.forEach((paso, indice) => {
    expect(within(pasos[indice]).getByRole("heading", { name: paso.titulo })).toBeTruthy();
    expect(within(pasos[indice]).getByText(paso.detalle)).toBeTruthy();
  });
});

test("el bloque final enlaza a Contacto y al correo y muestra la nota legal", () => {
  render(<MemoryRouter><Garantia /></MemoryRouter>);

  const ayuda = within(screen.getByRole("complementary"));
  expect(ayuda.getByRole("link", { name: "Contacto" }).getAttribute("href")).toBe("/contacto");
  expect(ayuda.getByRole("link", { name: "contacto@sonidovivo.cl" }).getAttribute("href")).toBe(
    "mailto:contacto@sonidovivo.cl"
  );
  expect(ayuda.getByText(garantia.nota)).toBeTruthy();
});

test("la ruta /garantia muestra la vista dentro de la página (con encabezado y pie)", () => {
  window.history.pushState({}, "", "/garantia");
  render(<App />);

  expect(screen.getByRole("heading", { level: 1, name: "Garantía" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Carrito de compras" })).toBeTruthy();
  expect(screen.getByRole("contentinfo")).toBeTruthy();
});

test("el enlace 'Garantía' del pie de página lleva a la vista", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);

  await user.click(within(screen.getByRole("contentinfo")).getByRole("link", { name: "Garantía" }));

  expect(window.location.pathname).toBe("/garantia");
  expect(screen.getByRole("heading", { level: 1, name: "Garantía" })).toBeTruthy();
});
