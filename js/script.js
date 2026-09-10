
document.addEventListener("DOMContentLoaded", function () {

  const formulario = document.getElementById("formRegistro");
  const mensajeExito = document.getElementById("mensajeExito");

  if (!formulario) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();   

    limpiarErrores();

    const nombre    = document.getElementById("nombre").value.trim();
    const email     = document.getElementById("email").value.trim();
    const telefono  = document.getElementById("telefono").value.trim();
    const password  = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    const terminos  = document.getElementById("terminos").checked;

    let hayErrores = false;

    if (nombre.length < 3) {
      mostrarError("nombre", "Escribe tu nombre completo (mínimo 3 caracteres).");
      hayErrores = true;
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoEmail.test(email)) {
      mostrarError("email", "Ingresa un correo electrónico válido.");
      hayErrores = true;
    }

    if (telefono !== "") {
      const soloDigitos = telefono.replace(/[^0-9]/g, "");
      const formatoTelefono = /^[0-9+\s-]+$/;
      if (!formatoTelefono.test(telefono) || soloDigitos.length < 8) {
        mostrarError("telefono", "El teléfono no es válido (mínimo 8 dígitos).");
        hayErrores = true;
      }
    }

    const tieneLetra  = /[a-zA-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    if (password.length < 8 || !tieneLetra || !tieneNumero) {
      mostrarError("password", "La contraseña debe tener 8+ caracteres, con letras y números.");
      hayErrores = true;
    }

    if (password2 !== password || password2 === "") {
      mostrarError("password2", "Las contraseñas no coinciden.");
      hayErrores = true;
    }

    if (!terminos) {
      mostrarError("terminos", "Debes aceptar los términos y condiciones.");
      hayErrores = true;
    }

    if (hayErrores) {
      mensajeExito.hidden = true;
      return;
    }

    mensajeExito.hidden = false;
    formulario.reset();

    console.log("Nuevo usuario:", { nombre, email, telefono });
  });

  function mostrarError(idCampo, texto) {
    const mensaje = document.getElementById("error-" + idCampo);
    const input = document.getElementById(idCampo);

    if (mensaje) mensaje.textContent = texto;
    if (input) input.classList.add("invalido");
  }

  function limpiarErrores() {
    const mensajes = document.querySelectorAll(".error");
    mensajes.forEach(function (m) {
      m.textContent = "";
    });

    const inputs = document.querySelectorAll("input");
    inputs.forEach(function (i) {
      i.classList.remove("invalido");
    });
  }

});
