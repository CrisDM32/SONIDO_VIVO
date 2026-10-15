const PEDIDO_KEY = "sv_ultimo_pedido";

document.addEventListener("DOMContentLoaded", function () {

  const resumenItems = document.getElementById("resumenPagoItems");
  const totalEl       = document.getElementById("pagoTotal");
  const btnPagar       = document.getElementById("btnPagar");
  const procesando     = document.getElementById("pagoProcesando");

  if (!resumenItems) return;

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    window.location.href = "carrito.html";
    return;
  }

  pintarResumen(carrito);

  btnPagar.addEventListener("click", function () {
    simularPago(carrito);
  });


  function pintarResumen(carrito) {
    resumenItems.innerHTML = carrito.map(function (item) {
      return `
        <div class="resumen-item">
          <span>${item.icono} ${item.nombre} x${item.cantidad}</span>
          <span>${formatearPrecioCLP(item.precio * item.cantidad)}</span>
        </div>
      `;
    }).join("");

    totalEl.textContent = formatearPrecioCLP(calcularTotalCarrito(carrito));
  }

  function simularPago(carrito) {
    btnPagar.disabled = true;
    procesando.hidden = false;

    setTimeout(function () {
      guardarPedido(carrito);
      vaciarCarrito(); 
      window.location.href = "resumen.html";
    }, 1500);
  }

  function guardarPedido(carrito) {
    const pedido = {
      numero: generarNumeroPedido(),
      fecha: new Date().toLocaleString("es-CL"),
      items: carrito,
      total: calcularTotalCarrito(carrito)
    };

    localStorage.setItem(PEDIDO_KEY, JSON.stringify(pedido));
  }

  function generarNumeroPedido() {
    const numeroAlAzar = Math.floor(10000 + Math.random() * 90000);
    return "SV-" + numeroAlAzar;
  }

});
