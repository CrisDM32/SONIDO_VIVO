const CARRITO_KEY = "sv_carrito";

export function obtenerCarrito() {
  const datos = localStorage.getItem(CARRITO_KEY);
  return datos ? JSON.parse(datos) : [];
}

export function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

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
