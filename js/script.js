
function moverGrid(direccion) {
    const grid = document.getElementById("product-list");
    const desplazamiento = 290;

    if (direccion === 1) {
        if (grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 5) {
            grid.scrollLeft = 0;
        } else {
            grid.scrollLeft += desplazamiento;
        }
    }

    if (direccion === -1) {
        if (grid.scrollLeft <= 5) {
            grid.scrollLeft = grid.scrollWidth - grid.clientWidth;
        } else {
            grid.scrollLeft -= desplazamiento;
        }
    }
}

function agregarAlCarrito(event, producto) {
    event.preventDefault();
    event.stopPropagation();

    console.log(producto + "añadido al carrito");
}