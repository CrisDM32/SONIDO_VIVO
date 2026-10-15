const CARRITO_KEY = "sv_carrito";

function obtenerCarrito() {
  const datos = localStorage.getItem(CARRITO_KEY);
  return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(function (item) { return item.id === producto.id; });

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      icono: producto.icono,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
}

function actualizarCantidad(id, cantidad) {
  const carrito = obtenerCarrito();
  const item = carrito.find(function (p) { return p.id === id; });
  if (!item) return;

  item.cantidad = Math.max(1, cantidad);
  guardarCarrito(carrito);
}

function eliminarDelCarrito(id) {
  const carrito = obtenerCarrito().filter(function (p) { return p.id !== id; });
  guardarCarrito(carrito);
}

function vaciarCarrito() {
  guardarCarrito([]);
}

function calcularTotalCarrito(carrito) {
  return carrito.reduce(function (total, item) {
    return total + (item.precio * item.cantidad);
  }, 0);
}

function formatearPrecioCLP(valor) {
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
}


document.addEventListener("DOMContentLoaded", function () {

  const contenedor = document.getElementById("carritoContenido");
  if (!contenedor) return;

  const totalEl   = document.getElementById("carritoTotal");
  const btnPagar  = document.getElementById("btnIrPagar");
  const btnVaciar = document.getElementById("btnVaciarCarrito");

  renderizarCarrito();

  btnVaciar.addEventListener("click", function () {
    vaciarCarrito();
    renderizarCarrito();
  });

  btnPagar.addEventListener("click", function (evento) {
    if (obtenerCarrito().length === 0) {
      evento.preventDefault();
    }
  });

  function renderizarCarrito() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
      contenedor.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío. ' +
        '<a href="productos.html">Ver catálogo</a></p>';
      totalEl.textContent = formatearPrecioCLP(0);
      btnPagar.classList.add("deshabilitado");
      return;
    }

    btnPagar.classList.remove("deshabilitado");

    contenedor.innerHTML = carrito.map(function (item) {
      return `
        <div class="carrito-item" data-id="${item.id}">
          <div class="carrito-item-icono">${item.icono}</div>
          <div class="carrito-item-info">
            <h3>${item.nombre}</h3>
            <p>${formatearPrecioCLP(item.precio)} c/u</p>
          </div>
          <div class="carrito-item-cantidad">
            <button type="button" class="btn-cantidad" data-accion="restar">-</button>
            <input type="number" class="input-cantidad" value="${item.cantidad}" min="1">
            <button type="button" class="btn-cantidad" data-accion="sumar">+</button>
          </div>
          <p class="carrito-item-subtotal">${formatearPrecioCLP(item.precio * item.cantidad)}</p>
          <button type="button" class="btn-eliminar" title="Eliminar producto">✕</button>
        </div>
      `;
    }).join("");

    totalEl.textContent = formatearPrecioCLP(calcularTotalCarrito(carrito));

    contenedor.querySelectorAll(".carrito-item").forEach(function (fila) {
      const id = Number(fila.dataset.id);
      const input = fila.querySelector(".input-cantidad");

      fila.querySelector('[data-accion="sumar"]').addEventListener("click", function () {
        actualizarCantidad(id, Number(input.value) + 1);
        renderizarCarrito();
      });

      fila.querySelector('[data-accion="restar"]').addEventListener("click", function () {
        actualizarCantidad(id, Number(input.value) - 1);
        renderizarCarrito();
      });

      input.addEventListener("change", function () {
        actualizarCantidad(id, Number(input.value) || 1);
        renderizarCarrito();
      });

      fila.querySelector(".btn-eliminar").addEventListener("click", function () {
        eliminarDelCarrito(id);
        renderizarCarrito();
      });
    });
  }
});
