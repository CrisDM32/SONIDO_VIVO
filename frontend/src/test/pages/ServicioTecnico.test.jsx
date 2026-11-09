import { MemoryRouter } from "react-router-dom";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import ServicioTecnico from "../../pages/ServicioTecnico";
import App from "../../App";
import { servicioTecnico } from "../../data/servicioTecnico";

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

test("muestra el título y la introducción del servicio técnico", () => {
  render(<MemoryRouter><ServicioTecnico /></MemoryRouter>);

  expect(screen.getByRole("heading", { level: 1, name: "Servicio técnico" })).toBeTruthy();
  expect(screen.getByText(servicioTecnico.introduccion)).toBeTruthy();
});

test("muestra una tarjeta por cada tipo de equipo que se revisa", () => {
  render(<MemoryRouter><ServicioTecnico /></MemoryRouter>);

  const tarjetas = screen.getAllByRole("article");
  expect(tarjetas).toHaveLength(servicioTecnico.servicios.length);

  servicioTecnico.servicios.forEach((servicio) => {
    const tarjeta = screen.getByRole("heading", { name: servicio.titulo }).closest("article");
    expect(within(tarjeta).getByText(servicio.descripcion)).toBeTruthy();
  });
});

test("muestra los pasos para solicitar el servicio, en orden", () => {
  render(<MemoryRouter><ServicioTecnico /></MemoryRouter>);

  const seccion = screen.getByRole("heading", { name: "¿Cómo solicitar el servicio?" }).closest("section");
  const pasos = within(seccion).getAllByRole("listitem");

  expect(pasos).toHaveLength(servicioTecnico.pasos.length);
  servicioTecnico.pasos.forEach((paso, indice) => {
    expect(within(pasos[indice]).getByRole("heading", { name: paso.titulo })).toBeTruthy();
    expect(within(pasos[indice]).getByText(paso.detalle)).toBeTruthy();
  });
});

test("lista la información que se necesita para atender el equipo", () => {
  render(<MemoryRouter><ServicioTecnico /></MemoryRouter>);

  const seccion = screen.getByRole("heading", { name: "¿Qué información necesitamos?" }).closest("section");
  expect(within(seccion).getAllByRole("listitem")).toHaveLength(servicioTecnico.informacion.length);
  expect(within(seccion).getByText(servicioTecnico.informacion[0])).toBeTruthy();
});

test("el bloque final enlaza a Contacto, al correo y a la garantía", () => {
  render(<MemoryRouter><ServicioTecnico /></MemoryRouter>);

  const bloque = within(screen.getByRole("complementary"));
  expect(bloque.getByRole("heading", { name: "¿Necesitas servicio técnico?" })).toBeTruthy();
  expect(bloque.getByRole("link", { name: "Contacto" }).getAttribute("href")).toBe("/contacto");
  expect(bloque.getByRole("link", { name: "contacto@sonidovivo.cl" }).getAttribute("href")).toBe(
    "mailto:contacto@sonidovivo.cl"
  );

  expect(screen.getByRole("link", { name: "Ver garantía" }).getAttribute("href")).toBe("/garantia");
});

test("la ruta /servicio-tecnico muestra la vista dentro de la página (con encabezado y pie)", () => {
  window.history.pushState({}, "", "/servicio-tecnico");
  render(<App />);

  expect(screen.getByRole("heading", { level: 1, name: "Servicio técnico" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Carrito de compras" })).toBeTruthy();
  expect(screen.getByRole("contentinfo")).toBeTruthy();
});

test("el enlace 'Servicio Técnico' del pie de página lleva a la vista", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);

  await user.click(within(screen.getByRole("contentinfo")).getByRole("link", { name: "Servicio Técnico" }));

  expect(window.location.pathname).toBe("/servicio-tecnico");
  expect(screen.getByRole("heading", { level: 1, name: "Servicio técnico" })).toBeTruthy();
});
