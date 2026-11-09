import { MemoryRouter } from "react-router-dom";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import TerminosCondiciones from "../../pages/TerminosCondiciones";
import App from "../../App";
import { terminosCondiciones } from "../../data/terminosCondiciones";

const { introduccion, secciones } = terminosCondiciones;

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

test("muestra el título y la introducción", () => {
  render(<MemoryRouter><TerminosCondiciones /></MemoryRouter>);

  expect(screen.getByRole("heading", { level: 1, name: "Términos y condiciones" })).toBeTruthy();
  expect(screen.getByText(introduccion)).toBeTruthy();
});

test("muestra todas las secciones numeradas, con sus textos", () => {
  render(<MemoryRouter><TerminosCondiciones /></MemoryRouter>);

  secciones.forEach((seccion, indice) => {
    const titulo = screen.getByRole("heading", { level: 2, name: `${indice + 1}. ${seccion.titulo}` });
    const bloque = titulo.closest("section");
    seccion.parrafos.forEach((parrafo) => {
      expect(within(bloque).getByText(parrafo)).toBeTruthy();
    });
  });
});

test("el índice tiene un enlace por sección que apunta a su ancla", () => {
  render(<MemoryRouter><TerminosCondiciones /></MemoryRouter>);

  const indice = within(screen.getByRole("navigation", { name: "Índice de los términos y condiciones" }));
  const enlaces = indice.getAllByRole("link");

  expect(enlaces).toHaveLength(secciones.length);
  secciones.forEach((seccion, indiceSeccion) => {
    expect(enlaces[indiceSeccion].textContent).toBe(`${indiceSeccion + 1}. ${seccion.titulo}`);
    expect(enlaces[indiceSeccion].getAttribute("href")).toBe(`#termino-${seccion.id}`);
    // cada ancla existe en la página
    expect(document.getElementById(`termino-${seccion.id}`)).toBeTruthy();
  });
});

test("los ids de las secciones no se repiten", () => {
  const ids = secciones.map((seccion) => seccion.id);

  expect(new Set(ids).size).toBe(ids.length);
});

test("la ruta /terminos-y-condiciones muestra la vista dentro de la página (con encabezado y pie)", () => {
  window.history.pushState({}, "", "/terminos-y-condiciones");
  render(<App />);

  expect(screen.getByRole("heading", { level: 1, name: "Términos y condiciones" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Carrito de compras" })).toBeTruthy();
  expect(screen.getByRole("contentinfo")).toBeTruthy();
});

test("los enlaces 'Terminos y Condiciones' del pie de página llevan a la vista", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);

  const enlaces = within(screen.getByRole("contentinfo")).getAllByRole("link", { name: "Terminos y Condiciones" });
  expect(enlaces.length).toBeGreaterThan(0);
  expect(enlaces.every((enlace) => enlace.getAttribute("href") === "/terminos-y-condiciones")).toBe(true);

  await user.click(enlaces[0]);
  expect(window.location.pathname).toBe("/terminos-y-condiciones");
  expect(screen.getByRole("heading", { level: 1, name: "Términos y condiciones" })).toBeTruthy();
});
