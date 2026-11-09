import { MemoryRouter, Route, Routes } from "react-router-dom";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test } from "vitest";
import Producto from "../../pages/Producto";

function renderProducto(id) {
  return render(
    <MemoryRouter initialEntries={[`/producto/${id}`]}>
      <Routes>
        <Route path="/producto/:id" element={<Producto />} />
      </Routes>
    </MemoryRouter>
  );
}

const carritoGuardado = () => JSON.parse(localStorage.getItem("sv_carrito") || "[]");

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

test("muestra nombre, código, precio, stock y descripción del producto", () => {
  renderProducto(1);

  expect(screen.getByRole("heading", { level: 1, name: "Guitarra Acústica Yamaha" })).toBeTruthy();
  expect(screen.getByText("Código: SV-INS-001")).toBeTruthy();
  expect(screen.getByText("$189.990")).toBeTruthy();
  expect(screen.getByText("En stock")).toBeTruthy();
  expect(screen.getByText(/Guitarra acústica de cuerdas de acero/)).toBeTruthy();
});

test("muestra la imagen principal y permite cambiar entre miniaturas", async () => {
  const user = userEvent.setup();
  renderProducto(1);

  expect(screen.getByAltText("Guitarra Acústica Yamaha - imagen 1")).toBeTruthy();

  const miniatura = screen.getByRole("button", { name: "Ver imagen 2" });
  expect(miniatura.getAttribute("aria-pressed")).toBe("false");

  await user.click(miniatura);

  expect(screen.getByAltText("Guitarra Acústica Yamaha - imagen 2")).toBeTruthy();
  expect(miniatura.getAttribute("aria-pressed")).toBe("true");
});

test("'Añadir al carrito' agrega el producto y muestra la confirmación", async () => {
  const user = userEvent.setup();
  renderProducto(6);

  await user.click(screen.getByRole("button", { name: "Añadir al carrito" }));

  expect(carritoGuardado()).toEqual([
    { id: 6, nombre: "Micrófono Shure SM58", precio: 89990, icono: "🎤", cantidad: 1 },
  ]);
  expect(screen.getByRole("button", { name: "¡Agregado! ✓" })).toBeTruthy();
});

test("añadir dos veces el mismo producto suma la cantidad", async () => {
  const user = userEvent.setup();
  renderProducto(7);

  const boton = screen.getByRole("button", { name: "Añadir al carrito" });
  await user.click(boton);
  await user.click(boton);

  expect(carritoGuardado()).toHaveLength(1);
  expect(carritoGuardado()[0].cantidad).toBe(2);
});

test("un producto agotado muestra 'Agotado' y no se puede añadir", async () => {
  const user = userEvent.setup();
  renderProducto(3);

  expect(screen.getAllByText("Agotado").length).toBeGreaterThan(0);
  const boton = screen.getByRole("button", { name: "Agotado" });
  expect(boton.disabled).toBe(true);

  await user.click(boton);
  expect(carritoGuardado()).toEqual([]);
});

test("con un id que no existe muestra 'Producto no encontrado' y un enlace al catálogo", () => {
  renderProducto(999);

  expect(screen.getByRole("heading", { name: "Producto no encontrado" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Volver a productos" }).getAttribute("href")).toBe("/productos");
  expect(screen.queryByRole("button", { name: "Añadir al carrito" })).toBeNull();
});
