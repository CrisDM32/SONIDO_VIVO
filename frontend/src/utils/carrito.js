/* ==========================================================================
   Carrito de compras - lógica compartida (versión React)
   Es el mismo "contrato" que tenía js/carrito.js en la versión HTML,
   pero con una diferencia importante:

   En la versión HTML, funciones como actualizarCantidad() MODIFICABAN
   directamente el objeto guardado (item.cantidad += 1) y después
   volvían a dibujar el carrito a mano con innerHTML.

   En React NUNCA se debe mutar un estado directamente: hay que crear
   un arreglo/objeto NUEVO y pasárselo a setState (acá, al setCarrito()
   de cada página). Por eso estas funciones ahora devuelven un carrito
   nuevo en vez de cambiar el que recibieron.
   ========================================================================== */

const CARRITO_KEY = "sv_carrito";

export function obtenerCarrito() {
  const datos = localStorage.getItem(CARRITO_KEY);
  return datos ? JSON.parse(datos) : [];
}

export function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

// Agrega un producto (o sube su cantidad en 1 si ya estaba).
// No recibe el carrito actual como parámetro: siempre lee el más
// reciente de localStorage, para que páginas distintas (Productos y
// Carrito) nunca se pisen entre sí.
export function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  const yaExiste = carrito.some((item) => item.id === producto.id);

  const nuevoCarrito = yaExiste
    ? carrito.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    : [
        ...carrito,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          icono: producto.icono,
          cantidad: 1,
        },
      ];

  guardarCarrito(nuevoCarrito);
  return nuevoCarrito;
}

// A diferencia de agregarAlCarrito(), estas sí reciben el carrito actual:
// la página Carrito.jsx ya lo tiene en su estado y evita leer localStorage
// dos veces por cada clic.
export function actualizarCantidad(carritoActual, id, cantidad) {
  const nuevoCarrito = carritoActual.map((item) =>
    item.id === id ? { ...item, cantidad: Math.max(1, cantidad) } : item
  );
  guardarCarrito(nuevoCarrito);
  return nuevoCarrito;
}

export function eliminarDelCarrito(carritoActual, id) {
  const nuevoCarrito = carritoActual.filter((item) => item.id !== id);
  guardarCarrito(nuevoCarrito);
  return nuevoCarrito;
}

export function vaciarCarrito() {
  guardarCarrito([]);
  return [];
}

export function calcularTotalCarrito(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

export function formatearPrecioCLP(valor) {
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
}
