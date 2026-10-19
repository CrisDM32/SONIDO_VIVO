import { useState } from "react";
const formInicial = {
  nombre: "",
  email: "",
  telefono: "",
  password: "",
  password2: "",
  terminos: false,
};

export default function Registro() {
  const [form, setForm] = useState(formInicial);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);

  function handleChange(evento) {
    const { name, value, type, checked } = evento.target;
    setForm((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validar() {
    const nuevosErrores = {};

    if (form.nombre.trim().length < 3) {
      nuevosErrores.nombre = "Escribe tu nombre completo (mínimo 3 caracteres).";
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoEmail.test(form.email.trim())) {
      nuevosErrores.email = "Ingresa un correo electrónico válido.";
    }

    if (form.telefono.trim() !== "") {
      const soloDigitos = form.telefono.replace(/[^0-9]/g, "");
      const formatoTelefono = /^[0-9+\s-]+$/;
      if (!formatoTelefono.test(form.telefono) || soloDigitos.length < 8) {
        nuevosErrores.telefono = "El teléfono no es válido (mínimo 8 dígitos).";
      }
    }

    const tieneLetra = /[a-zA-Z]/.test(form.password);
    const tieneNumero = /[0-9]/.test(form.password);
    if (form.password.length < 8 || !tieneLetra || !tieneNumero) {
      nuevosErrores.password = "La contraseña debe tener 8+ caracteres, con letras y números.";
    }

    if (form.password2 !== form.password || form.password2 === "") {
      nuevosErrores.password2 = "Las contraseñas no coinciden.";
    }

    if (!form.terminos) {
      nuevosErrores.terminos = "Debes aceptar los términos y condiciones.";
    }

    return nuevosErrores;
  }

  function handleSubmit(evento) {
    evento.preventDefault(); 

    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setExito(false);
      return;
    }

    console.log("Nuevo usuario:", form); 
    setExito(true);
    setForm(formInicial); 
  }

  return (
    <main className="contenedor-formulario">
      <h1>Crear cuenta de cliente</h1>
      <p className="subtitulo">
        Completa tus datos para crear tu perfil y poder hacer pedidos en línea.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="campo">
          <label htmlFor="nombre">Nombre completo *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: María González"
            className={errores.nombre ? "invalido" : ""}
          />
          <small className="error">{errores.nombre}</small>
        </div>

        <div className="campo">
          <label htmlFor="email">Correo electrónico *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
            className={errores.email ? "invalido" : ""}
          />
          <small className="error">{errores.email}</small>
        </div>

        <div className="campo">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="+56 9 1234 5678"
            className={errores.telefono ? "invalido" : ""}
          />
          <small className="error">{errores.telefono}</small>
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            className={errores.password ? "invalido" : ""}
          />
          <small className="error">{errores.password}</small>
        </div>

        <div className="campo">
          <label htmlFor="password2">Repetir contraseña *</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={form.password2}
            onChange={handleChange}
            placeholder="Vuelve a escribir la contraseña"
            className={errores.password2 ? "invalido" : ""}
          />
          <small className="error">{errores.password2}</small>
        </div>

        <div className="campo campo-checkbox">
          <label>
            <input
              type="checkbox"
              name="terminos"
              checked={form.terminos}
              onChange={handleChange}
            />
            Acepto los términos y condiciones *
          </label>
          <small className="error">{errores.terminos}</small>
        </div>

        <button type="submit" className="boton-principal">Crear cuenta</button>

        {exito && (
          <p className="mensaje-exito">
            ¡Cuenta creada correctamente! Ya puedes iniciar sesión.
          </p>
        )}
      </form>
    </main>
  );
}
