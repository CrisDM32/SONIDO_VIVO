async function cargarComponente(id, archivo) {

    const elemento = document.getElementById(id);

    const respuesta = await fetch(archivo);

    const contenido = await respuesta.text();

    elemento.innerHTML = contenido;
}


document.addEventListener("DOMContentLoaded", () => {

    cargarComponente("header", "components/header.html");

    cargarComponente("footer", "components/footer.html");

});