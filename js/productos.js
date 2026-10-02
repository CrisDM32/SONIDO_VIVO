const productos = [
  { id: 1,  nombre: "Guitarra Acústica Yamaha",            categoria: "Instrumentos",        precio: 189990, icono: "🎸", disponible: true  },
  { id: 2,  nombre: "Bajo Eléctrico Fender Precision",     categoria: "Instrumentos",        precio: 459990, icono: "🎸", disponible: true  },
  { id: 3,  nombre: "Batería Acústica 5 piezas",           categoria: "Instrumentos",        precio: 650000, icono: "🥁", disponible: false },
  { id: 4,  nombre: "Teclado Yamaha PSR",                  categoria: "Instrumentos",        precio: 299990, icono: "🎹", disponible: true  },
  { id: 5,  nombre: "Amplificador Fender Champion 20",     categoria: "Instrumentos",        precio: 149990, icono: "🔈", disponible: true  },
  { id: 6,  nombre: "Micrófono Shure SM58",                categoria: "Accesorios",          precio: 89990,  icono: "🎤", disponible: true  },
  { id: 7,  nombre: "Cable de instrumento 3 metros",       categoria: "Accesorios",          precio: 8990,   icono: "🔌", disponible: true  },
  { id: 8,  nombre: "Pedal de efectos Boss DS-1",          categoria: "Accesorios",          precio: 45990,  icono: "🎛️", disponible: true  },
  { id: 9,  nombre: "Correa para guitarra",                categoria: "Accesorios",          precio: 12990,  icono: "🎸", disponible: true  },
  { id: 10, nombre: "Interfaz de audio Focusrite 2i2",     categoria: "Estudio de Grabación", precio: 159990, icono: "🎚️", disponible: true  },
  { id: 11, nombre: "Monitores de estudio KRK Rokit 5",    categoria: "Estudio de Grabación", precio: 289990, icono: "🔊", disponible: false },
  { id: 12, nombre: "Audífonos de estudio Audio-Technica", categoria: "Estudio de Grabación", precio: 69990,  icono: "🎧", disponible: true  },
];

document.addEventListener("DOMContentLoaded", function () {

  const grid         = document.getElementById("catalogoGrid");
  const campoBuscar   = document.getElementById("buscarProducto");
  const botonBuscar    = document.getElementById("btnBuscar");

  if (!grid) return;

  renderizarProductos(productos);

  campoBuscar.addEventListener("input", function () {
    filtrarProductos();
  });

  botonBuscar.addEventListener("click", function () {
    filtrarProductos();
  });

  function filtrarProductos() {
    const texto = campoBuscar.value.trim().toLowerCase();

    const resultado = productos.filter(function (producto) {
      return producto.nombre.toLowerCase().includes(texto);
    });

    renderizarProductos(resultado);
  }

  function renderizarProductos(lista) {

    if (lista.length === 0) {
      grid.innerHTML = '<p class="sin-resultados">No se encontraron productos.</p>';
      return;
    }

    grid.innerHTML = lista.map(function (producto) {
      return `
        <article class="product-item">
          <div class="producto-icono">${producto.icono}</div>
          <p class="producto-categoria">${producto.categoria}</p>
          <h3>${producto.nombre}</h3>
          <p class="producto-precio">${formatearPrecio(producto.precio)}</p>
          <p class="producto-stock ${producto.disponible ? "disponible" : "agotado"}">
            ${producto.disponible ? "En stock" : "Agotado"}
          </p>
        </article>
      `;
    }).join("");
  }

  function formatearPrecio(valor) {
    return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
  }

});
