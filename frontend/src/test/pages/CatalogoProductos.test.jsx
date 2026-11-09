import { MemoryRouter } from "react-router-dom";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import CatalogoProductos from "../../pages/CatalogoProductos";
import { productosApi, stubCatalogo } from "../helpers/catalogo";

function renderCatalogo(props = {}) {
  return render(
    <MemoryRouter>
      <CatalogoProductos {...props} />
    </MemoryRouter>
  );
}

const carritoGuardado = () => JSON.parse(localStorage.getItem("sv_carrito") || "[]");

beforeEach(() => {
  localStorage.clear();
  // El catálogo se carga desde el backend (useProductos)
  stubCatalogo();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});

test("muestra todos los productos del catálogo con su precio", async () => {
  renderCatalogo();

  expect(await screen.findAllByRole("article")).toHaveLength(productosApi.length);
  expect(screen.getByRole("heading", { name: "Guitarra Acústica Yamaha" })).toBeTruthy();
  expect(screen.getByText("$189.990")).toBeTruthy();
});

test("'Agregar al carrito' guarda el producto con cantidad 1 y muestra la confirmación", async () => {
  const user = userEvent.setup();
  renderCatalogo();
  await screen.findAllByRole("article");

  const tarjeta = screen.getByRole("heading", { name: "Guitarra Acústica Yamaha" }).closest("article");
  await user.click(tarjeta.querySelector("button"));

  expect(carritoGuardado()).toEqual([
    { id: 1, nombre: "Guitarra Acústica Yamaha", precio: 189990, icono: "🎸", cantidad: 1 },
  ]);
  expect(tarjeta.querySelector("button").textContent).toBe("¡Agregado! ✓");
});

test("agregar el mismo producto dos veces suma la cantidad", async () => {
  const user = userEvent.setup();
  renderCatalogo();
  await screen.findAllByRole("article");

  const boton = screen.getByRole("heading", { name: "Micrófono Shure SM58" }).closest("article").querySelector("button");
  await user.click(boton);
  await user.click(boton);

  expect(carritoGuardado()).toHaveLength(1);
  expect(carritoGuardado()[0].cantidad).toBe(2);
});

test("se pueden agregar productos distintos", async () => {
  const user = userEvent.setup();
  renderCatalogo();
  await screen.findAllByRole("article");

  for (const nombre of ["Teclado Yamaha PSR", "Correa para guitarra"]) {
    await user.click(screen.getByRole("heading", { name: nombre }).closest("article").querySelector("button"));
  }

  expect(carritoGuardado().map((item) => item.nombre)).toEqual(["Teclado Yamaha PSR", "Correa para guitarra"]);
});

test("un producto agotado tiene el botón deshabilitado y no se agrega al carrito", async () => {
  const user = userEvent.setup();
  renderCatalogo();
  await screen.findAllByRole("article");

  const boton = screen.getByRole("heading", { name: "Batería Acústica 5 piezas" }).closest("article").querySelector("button");
  expect(boton.disabled).toBe(true);
  expect(boton.textContent).toBe("Agotado");

  await user.click(boton);
  expect(carritoGuardado()).toEqual([]);
});

test("el buscador filtra los productos por nombre", async () => {
  const user = userEvent.setup();
  renderCatalogo();
  await screen.findAllByRole("article");

  await user.type(screen.getByRole("searchbox", { name: "Buscar productos por nombre" }), "guitarra");

  const nombres = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
  expect(nombres).toEqual(["Guitarra Acústica Yamaha", "Correa para guitarra"]);
});

test("una búsqueda sin coincidencias muestra el mensaje de sin resultados", async () => {
  const user = userEvent.setup();
  renderCatalogo();
  await screen.findAllByRole("article");

  await user.type(screen.getByRole("searchbox", { name: "Buscar productos por nombre" }), "zzzz");

  expect(screen.getByRole("status").textContent).toBe("No se encontraron productos.");
  expect(screen.queryAllByRole("article")).toHaveLength(0);
});

test("con una categoría solo muestra los productos de esa categoría", async () => {
  renderCatalogo({ categoria: "Accesorios" });

  const tarjetas = await screen.findAllByRole("article");
  expect(tarjetas).toHaveLength(productosApi.filter((p) => p.categoria === "Accesorios").length);
  expect(screen.queryByRole("heading", { name: "Guitarra Acústica Yamaha" })).toBeNull();
  expect(screen.getByRole("heading", { name: "Micrófono Shure SM58" })).toBeTruthy();
});

test("cada tarjeta enlaza al detalle del producto", async () => {
  renderCatalogo();
  await screen.findAllByRole("article");

  const enlace = screen.getByRole("heading", { name: "Teclado Yamaha PSR" }).closest("a");
  expect(enlace.getAttribute("href")).toBe("/producto/4");
});

test("un producto desactivado en el panel no aparece en el catálogo", async () => {
  stubCatalogo(productosApi.filter((p) => p.id !== 1));
  renderCatalogo();

  expect(await screen.findAllByRole("article")).toHaveLength(productosApi.length - 1);
  expect(screen.queryByRole("heading", { name: "Guitarra Acústica Yamaha" })).toBeNull();
});

test("un producto sin stock en el backend se muestra agotado", async () => {
  stubCatalogo(productosApi.map((p) => (p.id === 1 ? { ...p, disponible: false } : p)));
  renderCatalogo();
  await screen.findAllByRole("article");

  const boton = screen.getByRole("heading", { name: "Guitarra Acústica Yamaha" }).closest("article").querySelector("button");
  expect(boton.disabled).toBe(true);
});

test("un producto nuevo creado desde el panel aparece en el catálogo", async () => {
  stubCatalogo([{ id: 50, nombre: "Cuerdas Elixir", categoria: "Accesorios", precio: 15990, icono: "🎼", disponible: true }, ...productosApi]);
  renderCatalogo();

  expect(await screen.findByRole("heading", { name: "Cuerdas Elixir" })).toBeTruthy();
});

test("mientras carga muestra un aviso y si el backend falla, un mensaje de error", async () => {
  vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("fail"))));
  renderCatalogo();

  expect(screen.getByText("Cargando productos...")).toBeTruthy();
  expect((await screen.findByRole("alert")).textContent).toBe("No se han cargado los productos");
});

// ---------- Paginación ----------

const muchos = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  codigo: `P${i + 1}`,
  nombre: `Producto ${String(i + 1).padStart(2, "0")}`,
  categoria: "Accesorios",
  precio: 1000 + i,
  icono: "🎸",
  disponible: true,
}));

const nombresVisibles = () => screen.getAllByRole("heading").map((h) => h.textContent);
const rango = () => screen.getByRole("status").textContent;

test("por defecto muestra 12 productos por página con el rango y la navegación", async () => {
  stubCatalogo(muchos);
  renderCatalogo();

  expect(await screen.findAllByRole("article")).toHaveLength(12);
  expect(rango()).toBe("Mostrando 1–12 de 30 productos");
  expect(screen.getByRole("combobox", { name: "Productos por página" }).value).toBe("12");
  const nav = within(screen.getByRole("navigation", { name: "Paginación del catálogo" }));
  expect(nav.getByRole("button", { name: "Página 1" }).getAttribute("aria-current")).toBe("page");
  expect(nav.getByRole("button", { name: "Página 3" })).toBeTruthy();
  expect(nav.getByRole("button", { name: "Anterior" }).disabled).toBe(true);
});

test("cambiar productos por página actualiza la cantidad y las páginas", async () => {
  const user = userEvent.setup();
  stubCatalogo(muchos);
  renderCatalogo();
  await screen.findAllByRole("article");

  await user.selectOptions(screen.getByRole("combobox", { name: "Productos por página" }), "6");

  expect(screen.getAllByRole("article")).toHaveLength(6);
  expect(rango()).toBe("Mostrando 1–6 de 30 productos");
  expect(screen.getByRole("button", { name: "Página 5" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Página 6" })).toBeNull();

  await user.selectOptions(screen.getByRole("combobox", { name: "Productos por página" }), "48");
  expect(screen.getAllByRole("article")).toHaveLength(30);
  expect(screen.queryByRole("navigation", { name: "Paginación del catálogo" })).toBeNull();
});

test("Siguiente, Anterior y los números de página cambian los productos mostrados", async () => {
  const user = userEvent.setup();
  stubCatalogo(muchos);
  renderCatalogo();
  await screen.findAllByRole("article");
  expect(nombresVisibles()[0]).toBe("Producto 01");

  await user.click(screen.getByRole("button", { name: "Siguiente" }));
  expect(nombresVisibles()).toHaveLength(12);
  expect(nombresVisibles()[0]).toBe("Producto 13");
  expect(rango()).toBe("Mostrando 13–24 de 30 productos");
  expect(screen.getByRole("button", { name: "Página 2" }).getAttribute("aria-current")).toBe("page");

  await user.click(screen.getByRole("button", { name: "Página 3" }));
  expect(nombresVisibles()).toHaveLength(6);
  expect(rango()).toBe("Mostrando 25–30 de 30 productos");
  expect(screen.getByRole("button", { name: "Siguiente" }).disabled).toBe(true);

  await user.click(screen.getByRole("button", { name: "Anterior" }));
  expect(nombresVisibles()[0]).toBe("Producto 13");
});

test("buscar o cambiar la cantidad por página vuelve a la primera página", async () => {
  const user = userEvent.setup();
  stubCatalogo(muchos);
  renderCatalogo();
  await screen.findAllByRole("article");

  await user.click(screen.getByRole("button", { name: "Página 3" }));
  await user.type(screen.getByRole("searchbox", { name: "Buscar productos por nombre" }), "Producto 2");
  expect(rango()).toBe("Mostrando 1–10 de 10 productos");
  expect(screen.queryByRole("navigation", { name: "Paginación del catálogo" })).toBeNull();

  await user.clear(screen.getByRole("searchbox", { name: "Buscar productos por nombre" }));
  await user.click(screen.getByRole("button", { name: "Página 2" }));
  await user.selectOptions(screen.getByRole("combobox", { name: "Productos por página" }), "24");
  expect(rango()).toBe("Mostrando 1–24 de 30 productos");
});

test("agregar al carrito funciona en cualquier página", async () => {
  const user = userEvent.setup();
  stubCatalogo(muchos);
  renderCatalogo();
  await screen.findAllByRole("article");
  await user.click(screen.getByRole("button", { name: "Siguiente" }));

  const tarjeta = screen.getByRole("heading", { name: "Producto 13" }).closest("article");
  await user.click(tarjeta.querySelector("button"));

  expect(carritoGuardado()).toEqual([{ id: 13, nombre: "Producto 13", precio: 1012, icono: "🎸", cantidad: 1 }]);
});
