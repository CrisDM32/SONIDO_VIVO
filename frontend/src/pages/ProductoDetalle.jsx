import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { obtenerProductoPorId } from "../api/productos";
import { agregarAlCarrito, formatearPrecioCLP } from "../utils/carrito";

/* ==========================================================================
   Vista de un solo producto (antes no existía ninguna versión de esta
   página, ni en HTML ni en React: el catálogo solo mostraba tarjetas
   resumidas, sin un lugar para ver especificaciones completas).

   La URL lleva el id del producto, ej: /productos/3. useParams() lee ese
   "3" de la URL (la ruta se define en App.jsx como "/productos/:id").
   Con ese id se pide el detalle a ms-productos vía GET /api/productos/{id}
   (el controller ya existía en el backend; lo único nuevo ahí es el campo
   "descripcion", que se agregó para esta pantalla).
   ========================================================================== */

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [agregado, setAgregado] = useState(false);

  // Si el usuario navega de un producto a otro (ej: desde un link relacionado),
  // el [id] en el arreglo de dependencias hace que useEffect se vuelva a
  // ejecutar y pida el nuevo producto, en vez de quedarse con el anterior.
  useEffect(() => {
    setCargando(true);
    setError("");

    obtenerProductoPorId(id)
      .then(setProducto)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [id]);

  function handleAgregar() {
    agregarAlCarrito(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  if (cargando) {
    return (
      <main className="contenedor-ancho">
        <p className="sin-resultados">Cargando producto...</p>
      </main>
    );
  }

  if (error || !producto) {
    return (
      <main className="contenedor-ancho">
        <h1 className="section-title-productos">Producto no encontrado</h1>
        {error && <p className="aviso-simulacion">⚠️ {error}</p>}
        <p className="carrito-vacio">
          <Link to="/productos">Volver al catálogo</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="contenedor-ancho">
      <button type="button" className="boton-secundario" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="detalle-producto">
        <div className="detalle-icono">{producto.icono}</div>

        <div className="detalle-info">
          <p className="producto-categoria">{producto.categoria}</p>
          <h1>{producto.nombre}</h1>
          <p className="producto-precio detalle-precio">{formatearPrecioCLP(producto.precio)}</p>

          <p className={`producto-stock ${producto.disponible ? "disponible" : "agotado"}`}>
            {producto.disponible ? `En stock (${producto.stock} disponibles)` : "Agotado"}
          </p>

          <h2>Detalles y especificaciones</h2>
          <p className="detalle-descripcion">
            {producto.descripcion || "Este producto todavía no tiene una descripción cargada."}
          </p>

          {producto.disponible ? (
            <button type="button" className="boton-principal boton-ancho-auto" onClick={handleAgregar}>
              {agregado ? "¡Agregado al carrito! ✓" : "Agregar al carrito"}
            </button>
          ) : (
            <button type="button" className="boton-principal boton-ancho-auto" disabled>
              Agotado
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
