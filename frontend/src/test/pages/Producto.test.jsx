import { MemoryRouter, Route, Routes } from "react-router-dom";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Producto from "../../pages/Producto";
import GaleriaProducto from "../../components/producto/GaleriaProducto";
import { productosApi, stubCatalogo } from "../helpers/catalogo";

async function renderProducto(id) {
  render(
    <MemoryRouter initialEntries={[`/producto/${id}`]}>
      <Routes>
        <Route path="/producto/:id" element={<Producto />} />
      </Routes>
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.queryByText("Cargando producto...")).toBeNull());
}

const carritoGuardado = () => JSON.parse(localStorage.getItem("sv_carrito") || "[]");

beforeEach(() => {
  localStorage.clear();
  stubCatalogo();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});

test("muestra nombre, código, precio, stock y descripción del producto", async () => {
  await renderProducto(1);

  expect(screen.getByRole("heading", { level: 1, name: "Guitarra Acústica Yamaha" })).toBeTruthy();
  expect(screen.getByText("Código: SV-INS-001")).toBeTruthy();
  expect(screen.getByText("$189.990")).toBeTruthy();
  expect(screen.getByText("En stock")).toBeTruthy();
  expect(screen.getByText(/Guitarra acústica de cuerdas de acero/)).toBeTruthy();
});

test("muestra la imagen del producto", async () => {
  await renderProducto(1);

  expect(screen.getByAltText("Guitarra Acústica Yamaha - imagen 1")).toBeTruthy();
});

test("la galería permite cambiar entre miniaturas cuando hay varias imágenes", async () => {
  const user = userEvent.setup();
  render(<GaleriaProducto imagenes={["a.png", "b.png", "c.png"]} nombre="Guitarra" icono="🎸" />);

  const miniatura = screen.getByRole("button", { name: "Ver imagen 2" });
  expect(miniatura.getAttribute("aria-pressed")).toBe("false");

  await user.click(miniatura);

  expect(screen.getByAltText("Guitarra - imagen 2")).toBeTruthy();
  expect(miniatura.getAttribute("aria-pressed")).toBe("true");
});

test("'Añadir al carrito' agrega el producto y muestra la confirmación", async () => {
  const user = userEvent.setup();
  await renderProducto(6);

  await user.click(screen.getByRole("button", { name: "Añadir al carrito" }));

  expect(carritoGuardado()).toEqual([
    { id: 6, nombre: "Micrófono Shure SM58", precio: 89990, icono: "🎤", cantidad: 1 },
  ]);
  expect(screen.getByRole("button", { name: "¡Agregado! ✓" })).toBeTruthy();
});

test("añadir dos veces el mismo producto suma la cantidad", async () => {
  const user = userEvent.setup();
  await renderProducto(7);

  const boton = screen.getByRole("button", { name: "Añadir al carrito" });
  await user.click(boton);
  await user.click(boton);

  expect(carritoGuardado()).toHaveLength(1);
  expect(carritoGuardado()[0].cantidad).toBe(2);
});

test("un producto agotado muestra 'Agotado' y no se puede añadir", async () => {
  const user = userEvent.setup();
  await renderProducto(3);

  expect(screen.getAllByText("Agotado").length).toBeGreaterThan(0);
  const boton = screen.getByRole("button", { name: "Agotado" });
  expect(boton.disabled).toBe(true);

  await user.click(boton);
  expect(carritoGuardado()).toEqual([]);
});

test("con un id que no existe muestra 'Producto no encontrado' y un enlace al catálogo", async () => {
  await renderProducto(999);

  expect(screen.getByRole("heading", { name: "Producto no encontrado" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Volver a productos" }).getAttribute("href")).toBe("/productos");
  expect(screen.queryByRole("button", { name: "Añadir al carrito" })).toBeNull();
});

test("un producto desactivado en el panel (ya no viene del backend) no se puede ver", async () => {
  stubCatalogo(productosApi.filter((p) => p.id !== 1));
  await renderProducto(1);

  expect(screen.getByRole("heading", { name: "Producto no encontrado" })).toBeTruthy();
});

test("el stock y el precio del backend mandan sobre los datos estáticos", async () => {
  stubCatalogo(productosApi.map((p) => (p.id === 1 ? { ...p, precio: 150000, disponible: false } : p)));
  await renderProducto(1);

  expect(screen.getByText("$150.000")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Agotado" }).disabled).toBe(true);
});

test("un producto creado desde el panel se muestra con sus datos y sin descripción si no la tiene", async () => {
  stubCatalogo([...productosApi, { id: 50, codigo: "AC050", nombre: "Cuerdas Elixir", categoria: "Accesorios", marca: "Elixir", modelo: "Nanoweb", precio: 15990, icono: "🎼", disponible: true }]);
  await renderProducto(50);

  expect(screen.getByRole("heading", { level: 1, name: "Cuerdas Elixir" })).toBeTruthy();
  expect(screen.getByText("Código: AC050")).toBeTruthy();
  expect(screen.getByText("Elixir · Nanoweb")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Añadir al carrito" })).toBeTruthy();
});

test("si el backend falla muestra un mensaje de error", async () => {
  vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("fail"))));
  await renderProducto(1);

  expect(screen.getByRole("alert").textContent).toBe("No se ha podido cargar el producto.");
});
