import { MemoryRouter } from "react-router-dom";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import PreguntasFrecuentes from "../../pages/PreguntasFrecuentes";
import App from "../../App";
import { preguntasFrecuentes } from "../../data/preguntasFrecuentes";

const totalPreguntas = preguntasFrecuentes.reduce((suma, seccion) => suma + seccion.preguntas.length, 0);

const detallesDe = (container) => [...container.querySelectorAll("details")];

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

test("muestra el título, el subtítulo y las secciones de preguntas", () => {
  render(<MemoryRouter><PreguntasFrecuentes /></MemoryRouter>);

  expect(screen.getByRole("heading", { level: 1, name: "Preguntas frecuentes" })).toBeTruthy();
  for (const seccion of preguntasFrecuentes) {
    expect(screen.getByRole("heading", { level: 2, name: seccion.titulo })).toBeTruthy();
  }
});

test("muestra todas las preguntas del contenido", () => {
  const { container } = render(<MemoryRouter><PreguntasFrecuentes /></MemoryRouter>);

  expect(detallesDe(container)).toHaveLength(totalPreguntas);
  expect(screen.getByText("¿Cómo compro un producto?")).toBeTruthy();
  expect(screen.getByText("¿Puedo pagar en cuotas?")).toBeTruthy();
  expect(screen.getByText("¿Hacen envíos a todo Chile?")).toBeTruthy();
});

test("las preguntas empiezan cerradas", () => {
  const { container } = render(<MemoryRouter><PreguntasFrecuentes /></MemoryRouter>);

  expect(detallesDe(container).every((detalle) => !detalle.open)).toBe(true);
});

test("al hacer clic en una pregunta se abre y muestra su respuesta; otro clic la cierra", async () => {
  const user = userEvent.setup();
  const { container } = render(<MemoryRouter><PreguntasFrecuentes /></MemoryRouter>);

  const pregunta = screen.getByText("¿Puedo pagar en cuotas?");
  const detalle = pregunta.closest("details");
  expect(detalle.open).toBe(false);

  await user.click(pregunta);
  expect(detalle.open).toBe(true);
  expect(within(detalle).getByText("Sí, puedes pagar en 12 cuotas sin interés.")).toBeTruthy();
  // abrir una no abre las demás
  expect(detallesDe(container).filter((d) => d.open)).toHaveLength(1);

  await user.click(pregunta);
  expect(detalle.open).toBe(false);
});

test("se pueden tener varias preguntas abiertas a la vez", async () => {
  const user = userEvent.setup();
  const { container } = render(<MemoryRouter><PreguntasFrecuentes /></MemoryRouter>);

  await user.click(screen.getByText("¿Puedo pagar en cuotas?"));
  await user.click(screen.getByText("¿Hacen envíos a todo Chile?"));

  expect(detallesDe(container).filter((d) => d.open)).toHaveLength(2);
});

test("el bloque de ayuda enlaza a Contacto y al correo", () => {
  render(<MemoryRouter><PreguntasFrecuentes /></MemoryRouter>);

  const ayuda = within(screen.getByRole("complementary"));
  expect(ayuda.getByRole("heading", { name: "¿No encontraste tu respuesta?" })).toBeTruthy();
  expect(ayuda.getByRole("link", { name: "Contacto" }).getAttribute("href")).toBe("/contacto");
  expect(ayuda.getByRole("link", { name: "contacto@sonidovivo.cl" }).getAttribute("href")).toBe(
    "mailto:contacto@sonidovivo.cl"
  );
});

test("la ruta /preguntas-frecuentes muestra la vista dentro de la página (con encabezado y pie)", () => {
  window.history.pushState({}, "", "/preguntas-frecuentes");
  render(<App />);

  expect(screen.getByRole("heading", { level: 1, name: "Preguntas frecuentes" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Carrito de compras" })).toBeTruthy();
  expect(screen.getByRole("contentinfo")).toBeTruthy();
});

test("los enlaces 'Preguntas Frecuentes' del pie de página llevan a la vista", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);

  const enlaces = within(screen.getByRole("contentinfo")).getAllByRole("link", { name: "Preguntas Frecuentes" });
  expect(enlaces.length).toBeGreaterThan(0);
  expect(enlaces.every((enlace) => enlace.getAttribute("href") === "/preguntas-frecuentes")).toBe(true);

  await user.click(enlaces[0]);
  expect(window.location.pathname).toBe("/preguntas-frecuentes");
  expect(screen.getByRole("heading", { level: 1, name: "Preguntas frecuentes" })).toBeTruthy();
});
