const PEDIDO_KEY = "sv_ultimo_pedido";

document.addEventListener("DOMContentLoaded", function () {

  const contenedor = document.getElementById("resumenContenido");
  if (!contenedor) return;

  const datosGuardados = localStorage.getItem(PEDIDO_KEY);

  if (!datosGuardados) {
    contenedor.innerHTML = `
      <h1 class="section-title-productos">Sin pedidos recientes</h1>
      <p class="resumen-vacio">
        Todavía no has realizado ninguna compra.
        <a href="productos.html">Ver catálogo</a>
      </p>
    `;
    return;
  }

  const pedido = JSON.parse(datosGuardados);

  const filasProductos = pedido.items.map(function (item) {
    return `
      <div class="resumen-item">
        <span>${item.icono} ${item.nombre} x${item.cantidad}</span>
        <span>${(item.precio * item.cantidad).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</span>
      </div>
    `;
  }).join("");

  contenedor.innerHTML = `
    <h1 class="section-title-productos">¡Compra realizada! ✅</h1>

    <section class="resumen-pedido">
      <p><strong>N° de pedido:</strong> ${pedido.numero}</p>
      <p><strong>Fecha:</strong> ${pedido.fecha}</p>

      <h2>Productos</h2>
      ${filasProductos}

      <div class="carrito-total-linea">
        <span>Total pagado:</span>
        <span class="carrito-total">${pedido.total.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</span>
      </div>
    </section>

    <a href="productos.html" class="boton-principal boton-ancho-auto">Seguir comprando</a>
  `;

});
