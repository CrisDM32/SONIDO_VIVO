import { MemoryRouter } from "react-router-dom";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import PoliticasPrivacidad from "../../pages/PoliticasPrivacidad";
import App from "../../App";
import { politicasPrivacidad } from "../../data/politicasPrivacidad";

const { introduccion, secciones } = politicasPrivacidad;

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
  render(<MemoryRouter><PoliticasPrivacidad /></MemoryRouter>);

  expect(screen.getByRole("heading", { level: 1, name: "Políticas de privacidad" })).toBeTruthy();
  expect(screen.getByText(introduccion)).toBeTruthy();
});

test("muestra todas las secciones numeradas, con sus textos", () => {
  render(<MemoryRouter><PoliticasPrivacidad /></MemoryRouter>);

  secciones.forEach((seccion, indice) => {
    const titulo = screen.getByRole("heading", { level: 2, name: `${indice + 1}. ${seccion.titulo}` });
    const bloque = titulo.closest("section");
    seccion.parrafos.forEach((parrafo) => {
      expect(within(bloque).getByText(parrafo)).toBeTruthy();
    });
  });
});

test("el índice tiene un enlace por sección que apunta a su ancla", () => {
  render(<MemoryRouter><PoliticasPrivacidad /></MemoryRouter>);

  const indice = within(screen.getByRole("navigation", { name: "Índice de las políticas de privacidad" }));
  const enlaces = indice.getAllByRole("link");

  expect(enlaces).toHaveLength(secciones.length);
  secciones.forEach((seccion, i) => {
    expect(enlaces[i].textContent).toBe(`${i + 1}. ${seccion.titulo}`);
    expect(enlaces[i].getAttribute("href")).toBe(`#privacidad-${seccion.id}`);
    expect(document.getElementById(`privacidad-${seccion.id}`)).toBeTruthy();
  });
});

test("los ids de las secciones no se repiten", () => {
  const ids = secciones.map((seccion) => seccion.id);

  expect(new Set(ids).size).toBe(ids.length);
});

test("la ruta /politicas-privacidad muestra la vista dentro de la página (con encabezado y pie)", () => {
  window.history.pushState({}, "", "/politicas-privacidad");
  render(<App />);

  expect(screen.getByRole("heading", { level: 1, name: "Políticas de privacidad" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Carrito de compras" })).toBeTruthy();
  expect(screen.getByRole("contentinfo")).toBeTruthy();
});

test("el enlace 'Politicas de Privacidad' del pie de página lleva a la vista", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);

  const enlace = within(screen.getByRole("contentinfo")).getByRole("link", { name: "Politicas de Privacidad" });
  expect(enlace.getAttribute("href")).toBe("/politicas-privacidad");

  await user.click(enlace);
  expect(window.location.pathname).toBe("/politicas-privacidad");
  expect(screen.getByRole("heading", { level: 1, name: "Políticas de privacidad" })).toBeTruthy();
});
