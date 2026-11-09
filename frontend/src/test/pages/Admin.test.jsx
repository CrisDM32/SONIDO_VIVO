import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import App from "../../App";
import { Variables } from "../../config/variables";
import { crearToken } from "../helpers/token";

const fetchMock = vi.fn();
let manejadores;
let productos;
let usuarios;

const producto = (datos) => ({ codigo: `GA00${datos.id}`, marca: "Yamaha", modelo: "F310", descripcion: "Descripción", categoria: "Guitarras Acústicas", precio: 100000, icono: "🎸", stock: 10, activo: true, disponible: true, destacado: false, ...datos });

beforeEach(() => {
  productos = [
    producto({ id: 1, nombre: "Guitarra Acústica Yamaha" }),
    producto({ id: 2, nombre: "Batería Acústica", stock: 0, disponible: false }),
    producto({ id: 3, nombre: "Micrófono Shure", categoria: "Accesorios", stock: 3, activo: false, disponible: false }),
  ];
  usuarios = [
    { id: 1, nombre: "Administrador", correo: "admin@sonidovivo.cl", rut: null, telefono: null, perfil: "administrador" },
    { id: 2, nombre: "Ana Pérez", correo: "ana@correo.cl", rut: "123456785", telefono: "+56 9 1234 5678", perfil: "cliente" },
  ];
  manejadores = {
    "GET /admin/productos": () => [200, productos],
    "GET /admin/usuarios": () => [200, { contenido: usuarios, pagina: 0, totalPaginas: 1, total: usuarios.length }],
  };

  fetchMock.mockReset();
  fetchMock.mockImplementation((url, opciones = {}) => {
    const ruta = new URL(url).pathname.replace("/api/v1", "");
    const manejador = manejadores[`${opciones.method ?? "GET"} ${ruta}`];
    const [estado, cuerpo] = manejador ? manejador(opciones) : [404, { mensaje: "Recurso no encontrado" }];
    return Promise.resolve({ ok: estado < 400, status: estado, json: () => Promise.resolve(cuerpo) });
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
  window.history.pushState({}, "", "/");
});

function abrirPanel(perfil = "administrador") {
  localStorage.setItem(Variables.tokenKey, crearToken({ perfil }));
  window.history.pushState({}, "", "/admin");
  render(<App />);
}

const llamadas = (metodo, ruta) =>
  fetchMock.mock.calls.filter(([url, op]) => (op?.method ?? "GET") === metodo && new URL(url).pathname.endsWith(ruta));

// ---------- Acceso ----------

test("sin sesión redirige al inicio de sesión", () => {
  window.history.pushState({}, "", "/admin");
  render(<App />);

  expect(window.location.pathname).toBe("/iniciar-sesion");
});

test("un cliente no puede entrar al panel y vuelve al inicio", () => {
  abrirPanel("cliente");

  expect(window.location.pathname).toBe("/");
  expect(screen.queryByRole("heading", { name: "Panel de administración" })).toBeNull();
});

test("el enlace al panel aparece en el menú solo para administrador y vendedor", () => {
  for (const [perfil, visible] of [["administrador", true], ["vendedor", true], ["cliente", false]]) {
    localStorage.setItem(Variables.tokenKey, crearToken({ perfil }));
    window.history.pushState({}, "", "/");
    render(<App />);

    const enlace = within(screen.getByRole("banner")).queryByRole("link", { name: "Panel de administración" });
    expect(Boolean(enlace)).toBe(visible);
    if (enlace) expect(enlace.getAttribute("href")).toBe("/admin");
    cleanup();
  }
});

test("el administrador ve las pestañas Productos y Usuarios; el vendedor solo productos", async () => {
  abrirPanel("administrador");
  expect(await screen.findByRole("tab", { name: "Usuarios" })).toBeTruthy();
  cleanup();

  abrirPanel("vendedor");
  expect(await screen.findByText("Guitarra Acústica Yamaha")).toBeTruthy();
  expect(screen.queryByRole("tab", { name: "Usuarios" })).toBeNull();
  expect(llamadas("GET", "/admin/usuarios")).toHaveLength(0);
});

// ---------- Productos ----------

test("lista los productos con el token de la sesión, incluidos los inactivos y las alertas de stock", async () => {
  abrirPanel();

  expect(await screen.findByText("Guitarra Acústica Yamaha")).toBeTruthy();
  expect(screen.getByText("Sin stock")).toBeTruthy();
  expect(screen.getByText("Stock bajo")).toBeTruthy();
  expect(screen.getByText("Inactivo")).toBeTruthy();
  expect(fetchMock.mock.calls[0][1].headers.Authorization).toMatch(/^Bearer /);
});

test("filtra por nombre y por categoría", async () => {
  const user = userEvent.setup();
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  await user.type(screen.getByLabelText("Buscar producto"), "bater");
  expect(screen.queryByText("Guitarra Acústica Yamaha")).toBeNull();
  expect(screen.getByText("Batería Acústica")).toBeTruthy();

  await user.clear(screen.getByLabelText("Buscar producto"));
  await user.selectOptions(screen.getByLabelText("Filtrar por categoría"), "Accesorios");
  expect(screen.getByText("Micrófono Shure")).toBeTruthy();
  expect(screen.queryByText("Batería Acústica")).toBeNull();
});

test("crea un producto: valida, envía los datos y refresca la lista", async () => {
  const user = userEvent.setup();
  manejadores["POST /admin/productos"] = (op) => {
    const datos = JSON.parse(op.body);
    productos.push(producto({ id: 4, ...datos }));
    return [201, productos[3]];
  };
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  await user.click(screen.getByRole("button", { name: "Nuevo producto" }));
  await user.click(screen.getByRole("button", { name: "Crear producto" }));
  expect(screen.getByText("El código debe tener entre 3 y 20 caracteres.")).toBeTruthy();
  expect(screen.getByText("El nombre debe tener entre 3 y 120 caracteres.")).toBeTruthy();
  expect(screen.getByText("El precio debe ser un número entero mayor que 0.")).toBeTruthy();
  expect(llamadas("POST", "/admin/productos")).toHaveLength(0);

  await user.type(screen.getByLabelText("Código *"), "AC050");
  await user.type(screen.getByLabelText("Nombre *"), "Cuerdas Elixir");
  await user.type(screen.getByLabelText("Marca"), "Elixir");
  await user.type(screen.getByLabelText("Descripción"), "Cuerdas con recubrimiento");
  await user.type(screen.getByLabelText("Icono *"), "🎼");
  await user.type(screen.getByLabelText("Precio (CLP) *"), "15990");
  await user.clear(screen.getByLabelText("Stock *"));
  await user.type(screen.getByLabelText("Stock *"), "25");
  await user.click(screen.getByRole("button", { name: "Crear producto" }));

  expect(await screen.findByText("Cuerdas Elixir")).toBeTruthy();
  expect(screen.getByRole("status").textContent).toBe("Producto creado.");
  expect(JSON.parse(llamadas("POST", "/admin/productos")[0][1].body)).toEqual({
    codigo: "AC050",
    nombre: "Cuerdas Elixir",
    categoria: "Guitarras Acústicas",
    marca: "Elixir",
    modelo: "",
    descripcion: "Cuerdas con recubrimiento",
    destacado: false,
    precio: 15990,
    stock: 25,
    icono: "🎼",
  });
});

test("un nombre repetido se muestra bajo el campo y se conserva lo escrito", async () => {
  const user = userEvent.setup();
  manejadores["POST /admin/productos"] = () => [409, { mensaje: "Ya existe un producto con ese nombre", campo: "nombre" }];
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  await user.click(screen.getByRole("button", { name: "Nuevo producto" }));
  await user.type(screen.getByLabelText("Código *"), "XX123");
  await user.type(screen.getByLabelText("Nombre *"), "Guitarra Acústica Yamaha");
  await user.type(screen.getByLabelText("Icono *"), "🎸");
  await user.type(screen.getByLabelText("Precio (CLP) *"), "1000");
  await user.click(screen.getByRole("button", { name: "Crear producto" }));

  expect(await screen.findByText("Ya existe un producto con ese nombre")).toBeTruthy();
  expect(screen.getByLabelText("Nombre *").value).toBe("Guitarra Acústica Yamaha");
  expect(screen.getByRole("button", { name: "Crear producto" }).disabled).toBe(false);
});

test("un código repetido se muestra bajo el campo código", async () => {
  const user = userEvent.setup();
  manejadores["POST /admin/productos"] = () => [409, { mensaje: "Ya existe un producto con ese código", campo: "codigo" }];
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  await user.click(screen.getByRole("button", { name: "Nuevo producto" }));
  await user.type(screen.getByLabelText("Código *"), "GA001");
  await user.type(screen.getByLabelText("Nombre *"), "Producto distinto");
  await user.type(screen.getByLabelText("Icono *"), "🎸");
  await user.type(screen.getByLabelText("Precio (CLP) *"), "1000");
  await user.click(screen.getByRole("button", { name: "Crear producto" }));

  expect(await screen.findByText("Ya existe un producto con ese código")).toBeTruthy();
});

test("el formulario ofrece las 10 categorías del catálogo", async () => {
  const user = userEvent.setup();
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  await user.click(screen.getByRole("button", { name: "Nuevo producto" }));
  const opciones = within(screen.getByLabelText("Categoría *")).getAllByRole("option").map((o) => o.textContent);

  expect(opciones).toHaveLength(10);
  expect(opciones).toContain("Estudio y Grabación");
  expect(opciones).not.toContain("Instrumentos");
});

test("edita un producto existente con PUT", async () => {
  const user = userEvent.setup();
  manejadores["PUT /admin/productos/1"] = (op) => [200, { ...productos[0], ...JSON.parse(op.body) }];
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  await user.click(screen.getByRole("button", { name: "Editar Guitarra Acústica Yamaha" }));
  expect(screen.getByLabelText("Precio (CLP) *").value).toBe("100000");
  await user.clear(screen.getByLabelText("Precio (CLP) *"));
  await user.type(screen.getByLabelText("Precio (CLP) *"), "120000");
  await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

  await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Producto actualizado."));
  expect(JSON.parse(llamadas("PUT", "/admin/productos/1")[0][1].body).precio).toBe(120000);
});

test("cambia el stock desde la fila y solo se puede guardar si cambió", async () => {
  const user = userEvent.setup();
  manejadores["PATCH /admin/productos/2/stock"] = (op) => {
    productos[1] = { ...productos[1], stock: JSON.parse(op.body).stock, disponible: true };
    return [200, productos[1]];
  };
  abrirPanel();
  await screen.findByText("Batería Acústica");

  const guardar = screen.getByRole("button", { name: "Guardar stock de Batería Acústica" });
  expect(guardar.disabled).toBe(true);

  await user.clear(screen.getByLabelText("Stock de Batería Acústica"));
  await user.type(screen.getByLabelText("Stock de Batería Acústica"), "8");
  expect(guardar.disabled).toBe(false);
  await user.click(guardar);

  await waitFor(() => expect(screen.queryByText("Sin stock")).toBeNull());
  expect(JSON.parse(llamadas("PATCH", "/admin/productos/2/stock")[0][1].body)).toEqual({ stock: 8 });
  expect(screen.getByLabelText("Stock de Batería Acústica").value).toBe("8");
});

test("desactivar pide confirmación y se puede cancelar", async () => {
  const user = userEvent.setup();
  manejadores["PATCH /admin/productos/1/activo"] = (op) => {
    productos[0] = { ...productos[0], activo: JSON.parse(op.body).activo };
    return [200, productos[0]];
  };
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  await user.click(screen.getByRole("button", { name: "Desactivar Guitarra Acústica Yamaha" }));
  await user.click(within(screen.getByRole("group", { name: "Confirmar desactivar Guitarra Acústica Yamaha" })).getByRole("button", { name: "Cancelar" }));
  expect(llamadas("PATCH", "/admin/productos/1/activo")).toHaveLength(0);

  await user.click(screen.getByRole("button", { name: "Desactivar Guitarra Acústica Yamaha" }));
  await user.click(screen.getByRole("button", { name: "Sí, desactivar" }));

  expect(await screen.findByRole("button", { name: "Reactivar Guitarra Acústica Yamaha" })).toBeTruthy();
  expect(JSON.parse(llamadas("PATCH", "/admin/productos/1/activo")[0][1].body)).toEqual({ activo: false });
});

test("un 403 del backend se muestra como mensaje y no cierra la sesión", async () => {
  manejadores["GET /admin/productos"] = () => [403, { mensaje: "No tienes permisos para esta acción" }];
  abrirPanel();

  expect((await screen.findByRole("alert")).textContent).toBe("No tienes permisos para esta acción");
  expect(localStorage.getItem(Variables.tokenKey)).not.toBeNull();
});

test("un 401 (sesión inválida o usuario eliminado) cierra la sesión y lleva al inicio de sesión", async () => {
  manejadores["GET /admin/productos"] = () => [401, { mensaje: "No autorizado" }];
  abrirPanel();

  await waitFor(() => expect(window.location.pathname).toBe("/iniciar-sesion"));
  expect(localStorage.getItem(Variables.tokenKey)).toBeNull();
});

// ---------- Usuarios ----------

async function abrirUsuarios(user) {
  abrirPanel();
  await user.click(await screen.findByRole("tab", { name: "Usuarios" }));
  await screen.findByText("Ana Pérez");
}

test("lista usuarios con sus datos y sin ninguna contraseña", async () => {
  const user = userEvent.setup();
  await abrirUsuarios(user);

  expect(screen.getByText("ana@correo.cl")).toBeTruthy();
  expect(screen.getByText("123456785")).toBeTruthy();
  expect(screen.getByText("(tú)")).toBeTruthy();
  expect(document.body.textContent).not.toMatch(/contraseña|clave/i);
});

test("busca usuarios por texto en el servidor", async () => {
  const user = userEvent.setup();
  await abrirUsuarios(user);

  await user.type(screen.getByLabelText("Buscar usuario"), "ana");
  await user.click(screen.getByRole("button", { name: "Buscar" }));

  await waitFor(() => expect(llamadas("GET", "/admin/usuarios").some(([url]) => new URL(url).searchParams.get("q") === "ana")).toBe(true));
});

test("el administrador no puede eliminar ni cambiar su propio perfil", async () => {
  const user = userEvent.setup();
  await abrirUsuarios(user);

  expect(screen.getByRole("button", { name: "Eliminar Administrador" }).disabled).toBe(true);
  expect(screen.getByLabelText("Perfil de Administrador").disabled).toBe(true);
  expect(screen.getByRole("button", { name: "Eliminar Ana Pérez" }).disabled).toBe(false);
});

test("cambia el perfil de un usuario", async () => {
  const user = userEvent.setup();
  manejadores["PATCH /admin/usuarios/2/perfil"] = (op) => {
    usuarios[1] = { ...usuarios[1], perfil: JSON.parse(op.body).perfil };
    return [200, usuarios[1]];
  };
  await abrirUsuarios(user);

  await user.selectOptions(screen.getByLabelText("Perfil de Ana Pérez"), "vendedor");

  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("vendedor"));
  expect(JSON.parse(llamadas("PATCH", "/admin/usuarios/2/perfil")[0][1].body)).toEqual({ perfil: "vendedor" });
});

test("eliminar un usuario pide confirmación y lo quita de la lista", async () => {
  const user = userEvent.setup();
  manejadores["DELETE /admin/usuarios/2"] = () => {
    usuarios = usuarios.filter((u) => u.id !== 2);
    return [204, {}];
  };
  await abrirUsuarios(user);

  await user.click(screen.getByRole("button", { name: "Eliminar Ana Pérez" }));
  expect(llamadas("DELETE", "/admin/usuarios/2")).toHaveLength(0);
  await user.click(screen.getByRole("button", { name: "Sí, eliminar" }));

  await waitFor(() => expect(screen.queryByText("Ana Pérez")).toBeNull());
  expect(llamadas("DELETE", "/admin/usuarios/2")).toHaveLength(1);
});

test("un rechazo del backend al eliminar se muestra y la lista no cambia", async () => {
  const user = userEvent.setup();
  manejadores["DELETE /admin/usuarios/2"] = () => [409, { mensaje: "No se puede eliminar al último administrador" }];
  await abrirUsuarios(user);

  await user.click(screen.getByRole("button", { name: "Eliminar Ana Pérez" }));
  await user.click(screen.getByRole("button", { name: "Sí, eliminar" }));

  expect((await screen.findByRole("alert")).textContent).toBe("No se puede eliminar al último administrador");
  expect(screen.getByText("Ana Pérez")).toBeTruthy();
});

test("crea un vendedor: valida, muestra errores del backend por campo y luego lo crea", async () => {
  const user = userEvent.setup();
  let intento = 0;
  manejadores["POST /admin/usuarios"] = (op) => {
    intento += 1;
    if (intento === 1) return [409, { mensaje: "Ya existe una cuenta con ese RUT", campo: "rut" }];
    const datos = JSON.parse(op.body);
    usuarios.push({ id: 3, nombre: datos.nombre, correo: datos.correo, rut: "123456785", telefono: null, perfil: datos.perfil });
    return [201, usuarios[2]];
  };
  await abrirUsuarios(user);

  await user.click(screen.getByRole("button", { name: "Nuevo usuario" }));
  await user.click(screen.getByRole("button", { name: "Crear usuario" }));
  expect(screen.getByText("Ingresa un RUT válido (ej: 12.345.678-5).")).toBeTruthy();
  expect(llamadas("POST", "/admin/usuarios")).toHaveLength(0);

  await user.type(screen.getByLabelText("Nombre completo *"), "Vera Vendedora");
  await user.type(screen.getByLabelText("Correo electrónico *"), "vera@sonidovivo.cl");
  await user.type(screen.getByLabelText("RUT *"), "12.345.678-5");
  await user.type(screen.getByLabelText("Contraseña *"), "clave1234");
  await user.click(screen.getByRole("button", { name: "Crear usuario" }));

  expect(await screen.findByText("Ya existe una cuenta con ese RUT")).toBeTruthy();

  await user.click(screen.getByRole("button", { name: "Crear usuario" }));
  expect(await screen.findByText("Vera Vendedora")).toBeTruthy();
  expect(JSON.parse(llamadas("POST", "/admin/usuarios")[1][1].body)).toMatchObject({ perfil: "vendedor", rut: "12.345.678-5" });
});

// ---------- Paginación de productos (12 por página, no configurable) ----------

function conMuchosProductos() {
  productos = Array.from({ length: 30 }, (_, i) =>
    producto({ id: i + 1, nombre: `Producto ${String(i + 1).padStart(2, "0")}`, categoria: i < 20 ? "Accesorios" : "Baterías" })
  );
}

const filasDeProductos = () => screen.getAllByRole("row").slice(1);

test("el panel muestra 12 productos por página, sin selector para cambiarlo", async () => {
  conMuchosProductos();
  abrirPanel();

  await screen.findByText("Producto 01");
  expect(filasDeProductos()).toHaveLength(12);
  expect(screen.getByText(/Mostrando/).textContent).toBe("Mostrando 1–12 de 30 productos");
  expect(screen.queryByRole("combobox", { name: /por página/i })).toBeNull();
  expect(within(screen.getByRole("navigation", { name: "Paginación de productos" })).getByRole("button", { name: "Página 3" })).toBeTruthy();
});

test("se navega entre páginas de productos", async () => {
  const user = userEvent.setup();
  conMuchosProductos();
  abrirPanel();
  await screen.findByText("Producto 01");

  await user.click(screen.getByRole("button", { name: "Siguiente" }));
  expect(screen.getByText("Producto 13")).toBeTruthy();
  expect(screen.queryByText("Producto 01")).toBeNull();
  expect(screen.getByText(/Mostrando/).textContent).toBe("Mostrando 13–24 de 30 productos");

  await user.click(screen.getByRole("button", { name: "Página 3" }));
  expect(filasDeProductos()).toHaveLength(6);
  expect(screen.getByRole("button", { name: "Siguiente" }).disabled).toBe(true);
});

test("buscar o filtrar por categoría vuelve a la primera página", async () => {
  const user = userEvent.setup();
  conMuchosProductos();
  abrirPanel();
  await screen.findByText("Producto 01");

  await user.click(screen.getByRole("button", { name: "Página 3" }));
  await user.selectOptions(screen.getByLabelText("Filtrar por categoría"), "Accesorios");
  expect(screen.getByText(/Mostrando/).textContent).toBe("Mostrando 1–12 de 20 productos");

  await user.click(screen.getByRole("button", { name: "Página 2" }));
  await user.type(screen.getByLabelText("Buscar producto"), "Producto 0");
  expect(screen.getByText(/Mostrando/).textContent).toBe("Mostrando 1–9 de 9 productos");
  expect(screen.queryByRole("navigation", { name: "Paginación de productos" })).toBeNull();
});

test("al guardar un cambio en la página 2 se queda en esa página", async () => {
  const user = userEvent.setup();
  conMuchosProductos();
  manejadores["PATCH /admin/productos/13/stock"] = (op) => {
    productos[12] = { ...productos[12], stock: JSON.parse(op.body).stock };
    return [200, productos[12]];
  };
  abrirPanel();
  await screen.findByText("Producto 01");
  await user.click(screen.getByRole("button", { name: "Siguiente" }));

  await user.clear(screen.getByLabelText("Stock de Producto 13"));
  await user.type(screen.getByLabelText("Stock de Producto 13"), "4");
  await user.click(screen.getByRole("button", { name: "Guardar stock de Producto 13" }));

  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Stock de"));
  expect(screen.getByText("Producto 13")).toBeTruthy();
  expect(screen.getByText(/Mostrando/).textContent).toBe("Mostrando 13–24 de 30 productos");
});

test("con 12 productos o menos no aparece la navegación", async () => {
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  expect(screen.queryByRole("navigation", { name: "Paginación de productos" })).toBeNull();
  expect(screen.getByText(/Mostrando/).textContent).toBe("Mostrando 1–3 de 3 productos");
});

// ---------- Destacados ----------

test("la tabla muestra con un check cuáles productos son destacados", async () => {
  productos[1] = { ...productos[1], destacado: true };
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  expect(screen.getByRole("checkbox", { name: "Destacado: Guitarra Acústica Yamaha" }).checked).toBe(false);
  expect(screen.getByRole("checkbox", { name: "Destacado: Batería Acústica" }).checked).toBe(true);
});

test("marcar el check guarda el producto como destacado y desmarcarlo lo quita", async () => {
  const user = userEvent.setup();
  manejadores["PATCH /admin/productos/1/destacado"] = (op) => {
    productos[0] = { ...productos[0], destacado: JSON.parse(op.body).destacado };
    return [200, productos[0]];
  };
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  await user.click(screen.getByRole("checkbox", { name: "Destacado: Guitarra Acústica Yamaha" }));

  await waitFor(() => expect(screen.getByRole("status").textContent).toBe('"Guitarra Acústica Yamaha" ahora es destacado.'));
  expect(JSON.parse(llamadas("PATCH", "/admin/productos/1/destacado")[0][1].body)).toEqual({ destacado: true });
  expect(screen.getByRole("checkbox", { name: "Destacado: Guitarra Acústica Yamaha" }).checked).toBe(true);

  await user.click(screen.getByRole("checkbox", { name: "Destacado: Guitarra Acústica Yamaha" }));
  await waitFor(() => expect(screen.getByRole("status").textContent).toBe('"Guitarra Acústica Yamaha" ya no es destacado.'));
  expect(screen.getByRole("checkbox", { name: "Destacado: Guitarra Acústica Yamaha" }).checked).toBe(false);
});

test("si el backend rechaza el cambio de destacado se muestra el error y el check vuelve a su valor", async () => {
  const user = userEvent.setup();
  manejadores["PATCH /admin/productos/1/destacado"] = () => [403, { mensaje: "No tienes permisos para esta acción" }];
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  await user.click(screen.getByRole("checkbox", { name: "Destacado: Guitarra Acústica Yamaha" }));

  expect((await screen.findByRole("alert")).textContent).toBe("No tienes permisos para esta acción");
  expect(screen.getByRole("checkbox", { name: "Destacado: Guitarra Acústica Yamaha" }).checked).toBe(false);
});

test("el formulario permite crear un producto ya marcado como destacado", async () => {
  const user = userEvent.setup();
  manejadores["POST /admin/productos"] = (op) => [201, { id: 9, ...JSON.parse(op.body) }];
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  await user.click(screen.getByRole("button", { name: "Nuevo producto" }));
  expect(screen.getByRole("checkbox", { name: /Producto destacado/ }).checked).toBe(false);
  await user.type(screen.getByLabelText("Código *"), "AC051");
  await user.type(screen.getByLabelText("Nombre *"), "Capo Premium");
  await user.type(screen.getByLabelText("Icono *"), "🎸");
  await user.type(screen.getByLabelText("Precio (CLP) *"), "9990");
  await user.click(screen.getByRole("checkbox", { name: /Producto destacado/ }));
  await user.click(screen.getByRole("button", { name: "Crear producto" }));

  await waitFor(() => expect(llamadas("POST", "/admin/productos")).toHaveLength(1));
  expect(JSON.parse(llamadas("POST", "/admin/productos")[0][1].body).destacado).toBe(true);
});

test("al editar un producto destacado el formulario lo muestra marcado", async () => {
  const user = userEvent.setup();
  productos[0] = { ...productos[0], destacado: true };
  abrirPanel();
  await screen.findByText("Guitarra Acústica Yamaha");

  await user.click(screen.getByRole("button", { name: "Editar Guitarra Acústica Yamaha" }));

  expect(screen.getByRole("checkbox", { name: /Producto destacado/ }).checked).toBe(true);
});
