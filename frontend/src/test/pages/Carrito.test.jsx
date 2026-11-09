import { MemoryRouter } from "react-router-dom";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test } from "vitest";
import Carrito from "./Carrito";

const guitarra = { id: 1, nombre: "Guitarra Acústica Yamaha", precio: 189990, icono: "🎸", cantidad: 2 };
const cable = { id: 7, nombre: "Cable de instrumento 3 metros", precio: 8990, icono: "🔌", cantidad: 1 };

function renderCarrito(items) {
  if (items) localStorage.setItem("sv_carrito", JSON.stringify(items));
  return render(
    <MemoryRouter>
      <Carrito />
    </MemoryRouter>
  );
}

const lineaDe = (nombre) => screen.getByRole("heading", { name: nombre }).closest("article");
const carritoGuardado = () => JSON.parse(localStorage.getItem("sv_carrito"));

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

test("con el carrito vacío muestra el aviso, total $0 y no permite ir a pagar", () => {
  renderCarrito();

  expect(screen.getByText(/Tu carrito está vacío/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "Ver catálogo" }).getAttribute("href")).toBe("/productos");
  expect(screen.getByText("$0")).toBeTruthy();

  expect(screen.queryByRole("link", { name: "Ir a pagar" })).toBeNull();
  expect(screen.getByText("Ir a pagar").getAttribute("aria-disabled")).toBe("true");
});

test("muestra cada producto con su precio unitario, subtotal y el total", () => {
  renderCarrito([guitarra, cable]);

  const lineaGuitarra = within(lineaDe("Guitarra Acústica Yamaha"));
  expect(lineaGuitarra.getByText("$189.990 c/u")).toBeTruthy();
  expect(lineaGuitarra.getByText("$379.980")).toBeTruthy();

  const lineaCable = within(lineaDe("Cable de instrumento 3 metros"));
  expect(lineaCable.getByText("$8.990 c/u")).toBeTruthy();

  // total = 189.990 x 2 + 8.990 x 1
  expect(screen.getByText("$388.970")).toBeTruthy();
});

test("con productos, 'Ir a pagar' es un enlace a /pago", () => {
  renderCarrito([guitarra]);

  expect(screen.getByRole("link", { name: "Ir a pagar" }).getAttribute("href")).toBe("/pago");
});

test("el botón + sube la cantidad y recalcula subtotal y total", async () => {
  const user = userEvent.setup();
  renderCarrito([cable]);

  await user.click(screen.getByRole("button", { name: "Aumentar cantidad de Cable de instrumento 3 metros" }));

  expect(screen.getByRole("spinbutton", { name: "Cantidad de Cable de instrumento 3 metros" }).value).toBe("2");
  expect(within(lineaDe("Cable de instrumento 3 metros")).getByText("$17.980")).toBeTruthy();
  expect(carritoGuardado()[0].cantidad).toBe(2);
});

test("el botón − baja la cantidad pero nunca por debajo de 1", async () => {
  const user = userEvent.setup();
  renderCarrito([guitarra]);

  const menos = screen.getByRole("button", { name: "Reducir cantidad de Guitarra Acústica Yamaha" });
  await user.click(menos);
  expect(screen.getByRole("spinbutton", { name: "Cantidad de Guitarra Acústica Yamaha" }).value).toBe("1");

  await user.click(menos);
  expect(screen.getByRole("spinbutton", { name: "Cantidad de Guitarra Acústica Yamaha" }).value).toBe("1");
  expect(carritoGuardado()[0].cantidad).toBe(1);
});

test("se puede escribir la cantidad directamente (reemplazando el número)", async () => {
  const user = userEvent.setup();
  renderCarrito([cable]);

  const campo = screen.getByRole("spinbutton", { name: "Cantidad de Cable de instrumento 3 metros" });
  await user.type(campo, "4", { initialSelectionStart: 0, initialSelectionEnd: 1 });

  expect(campo.value).toBe("4");
  expect(carritoGuardado()[0].cantidad).toBe(4);
  expect(within(lineaDe("Cable de instrumento 3 metros")).getByText("$35.960")).toBeTruthy();
});

test("se puede borrar el campo de cantidad y escribir otro número", async () => {
  const user = userEvent.setup();
  renderCarrito([{ ...cable, cantidad: 3 }]);

  const campo = screen.getByRole("spinbutton", { name: "Cantidad de Cable de instrumento 3 metros" });
  await user.clear(campo);
  expect(campo.value).toBe("");

  await user.type(campo, "4");

  expect(campo.value).toBe("4");
  expect(carritoGuardado()[0].cantidad).toBe(4);
  expect(within(lineaDe("Cable de instrumento 3 metros")).getByText("$35.960")).toBeTruthy();
});

test("si se deja el campo de cantidad vacío, al salir se restaura la cantidad anterior", async () => {
  const user = userEvent.setup();
  renderCarrito([{ ...cable, cantidad: 3 }]);

  const campo = screen.getByRole("spinbutton", { name: "Cantidad de Cable de instrumento 3 metros" });
  await user.clear(campo);
  await user.tab();

  expect(campo.value).toBe("3");
  expect(carritoGuardado()[0].cantidad).toBe(3);
});

test("escribir 0 en la cantidad la deja en 1", async () => {
  const user = userEvent.setup();
  renderCarrito([{ ...cable, cantidad: 3 }]);

  const campo = screen.getByRole("spinbutton", { name: "Cantidad de Cable de instrumento 3 metros" });
  await user.clear(campo);
  await user.type(campo, "0");

  expect(campo.value).toBe("1");
  expect(carritoGuardado()[0].cantidad).toBe(1);
});

test("la ✕ elimina solo ese producto y actualiza el total", async () => {
  const user = userEvent.setup();
  renderCarrito([guitarra, cable]);

  await user.click(screen.getByRole("button", { name: "Eliminar Guitarra Acústica Yamaha del carrito" }));

  expect(screen.queryByRole("heading", { name: "Guitarra Acústica Yamaha" })).toBeNull();
  expect(screen.getByRole("heading", { name: "Cable de instrumento 3 metros" })).toBeTruthy();
  expect(carritoGuardado().map((item) => item.id)).toEqual([7]);
  expect(screen.getAllByText("$8.990").length).toBeGreaterThan(0);
});

test("al eliminar el último producto aparece el carrito vacío y se deshabilita 'Ir a pagar'", async () => {
  const user = userEvent.setup();
  renderCarrito([cable]);

  await user.click(screen.getByRole("button", { name: "Eliminar Cable de instrumento 3 metros del carrito" }));

  expect(screen.getByText(/Tu carrito está vacío/)).toBeTruthy();
  expect(screen.queryByRole("link", { name: "Ir a pagar" })).toBeNull();
});

test("'Vaciar carrito' quita todos los productos y lo guarda", async () => {
  const user = userEvent.setup();
  renderCarrito([guitarra, cable]);

  await user.click(screen.getByRole("button", { name: "Vaciar carrito" }));

  expect(screen.getByText(/Tu carrito está vacío/)).toBeTruthy();
  expect(screen.getByText("$0")).toBeTruthy();
  expect(carritoGuardado()).toEqual([]);
});
