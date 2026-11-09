import { afterEach, expect, test, vi } from "vitest";
import { iniciarSesion, registrarUsuario } from "../../service/sesionService";
import { Rutas } from "../../service/endpoints";

afterEach(() => vi.unstubAllGlobals());

const credenciales = { correo: "admin@sonidovivo.cl", clave: "admin" };

test("envía las credenciales por POST y devuelve el token", async () => {
  const fetchFalso = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ token: "t0k3n" }) }));
  vi.stubGlobal("fetch", fetchFalso);

  await expect(iniciarSesion(credenciales)).resolves.toEqual({ token: "t0k3n" });

  const [url, opciones] = fetchFalso.mock.calls[0];
  expect(url).toBe(Rutas.login);
  expect(opciones.method).toBe("POST");
  expect(JSON.parse(opciones.body)).toEqual(credenciales);
});

test("si el backend rechaza las credenciales, lanza el mensaje recibido", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({ mensaje: "Correo o clave incorrectos" }) }))
  );

  await expect(iniciarSesion(credenciales)).rejects.toThrow("Correo o clave incorrectos");
});

test("si la respuesta de error no trae mensaje, usa uno genérico", async () => {
  vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.reject(new Error("vacío")) })));

  await expect(iniciarSesion(credenciales)).rejects.toThrow("No se pudo iniciar sesión.");
});

test("si no hay conexión, lanza un mensaje de conexión", async () => {
  vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))));

  await expect(iniciarSesion(credenciales)).rejects.toThrow("No se pudo conectar con el servicio.");
});

const datosRegistro = { nombre: "Ana Pérez", correo: "ana@correo.cl", rut: "12.345.678-5", telefono: "", clave: "clave1234" };

test("registrarUsuario envía los datos por POST al endpoint de registro", async () => {
  const fetchFalso = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ mensaje: "ok" }) }));
  vi.stubGlobal("fetch", fetchFalso);

  await expect(registrarUsuario(datosRegistro)).resolves.toEqual({ mensaje: "ok" });

  const [url, opciones] = fetchFalso.mock.calls[0];
  expect(url).toBe(Rutas.registro);
  expect(JSON.parse(opciones.body)).toEqual(datosRegistro);
});

test("registrarUsuario expone el mensaje y el campo duplicado que informa el backend", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({ mensaje: "Ya existe una cuenta con ese RUT", campo: "rut" }) }))
  );

  await expect(registrarUsuario(datosRegistro)).rejects.toMatchObject({
    message: "Ya existe una cuenta con ese RUT",
    campo: "rut",
  });
});

test("registrarUsuario informa si no hay conexión", async () => {
  vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("fail"))));

  await expect(registrarUsuario(datosRegistro)).rejects.toThrow("No se pudo conectar con el servicio.");
});
