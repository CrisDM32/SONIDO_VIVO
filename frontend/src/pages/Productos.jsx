import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { productos as productosEstaticos } from "../data/productos";
import { obtenerProductos } from "../api/productos";
import { agregarAlCarrito, formatearPrecioCLP } from "../utils/carrito";

/* ==========================================================================
   Catálogo de productos (antes: productos.html + js/productos.js)

   Diferencias clave con la versión HTML:
   - Antes, filtrarProductos() volvía a escribir TODO el HTML del grid
     con grid.innerHTML = lista.map(...).join(""). En React nunca se
     escribe HTML a mano: simplemente se calcula qué productos mostrar
     y se "retorna" ese JSX; React se encarga de actualizar solo lo que
     cambió en la pantalla.
   - No hace falta buscar los botones después de dibujarlos
     (grid.querySelectorAll(...)) para conectarles el evento: el
     onClick ya va directamente en el botón cuando se crea.

   Ahora que existe ms-productos, los productos ya NO vienen del arreglo
   fijo de data/productos.js: se piden por HTTP con useEffect apenas se
   monta la página. Ese arreglo fijo se deja solo como "productosEstaticos",
   un respaldo que se muestra si el backend no está disponible (por
   ejemplo, mientras se levanta por primera vez), para que la demo no se
   quede con la pantalla vacía.

   Filtro por categoría (Instrumentos, Accesorios, Estudio de Grabación):
   en vez de guardar la categoría elegida solo en un useState interno, se
   guarda en la URL como "?categoria=Instrumentos" usando useSearchParams.
   Eso tiene dos ventajas sobre un estado común: la vista filtrada queda
   en una URL que se puede compartir o guardar en favoritos (ej:
   /productos?categoria=Accesorios), y si el usuario recarga la página
   (F5) el filtro no se pierde, porque sigue viviendo en la URL.
   ========================================================================== */

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaActiva = searchParams.get("categoria") || "Todas";

  // "agregados" guarda, por id de producto, si hay que mostrar el
  // mensaje "¡Agregado! ✓" en ese botón en este momento.
  const [agregados, setAgregados] = useState({});

  // El arreglo vacio [] como segundo argumento le dice a React "ejecuta
  // este efecto una sola vez, apenas se dibuja el componente la primera
  // vez" (equivalente a un window.onload, pero por componente).
  useEffect(() => {
    obtenerProductos()
      .then((datos) => setProductos(datos))
      .catch(() => {
        setError("No se pudo conectar con el servidor. Mostrando catálogo guardado localmente.");
        setProductos(productosEstaticos);
      })
      .finally(() => setCargando(false));
  }, []);

  // Las categorías no vienen fijas en el código: se arman solas a partir
  // de lo que haya en `productos` en ese momento, usando Set para sacar
  // los duplicados. Así, si mañana el backend agrega una categoría nueva,
  // el filtro la muestra sin tener que tocar este archivo.
  const categorias = ["Todas", ...new Set(productos.map((producto) => producto.categoria))];

  // No se necesita un estado separado para "productos filtrados":
  // es un simple cálculo derivado de `productos` + `busqueda` + `categoriaActiva`,
  // y se vuelve a calcular en cada render (es barato, son solo unos pocos productos).
  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre.toLowerCase().includes(busqueda.trim().toLowerCase());
    const coincideCategoria = categoriaActiva === "Todas" || producto.categoria === categoriaActiva;
    return coincideNombre && coincideCategoria;
  });

  function handleFiltrarCategoria(categoria) {
    // "Todas" no se guarda en la URL (setSearchParams({}) la deja limpia,
    // como "/productos" sin parámetros); cualquier otra categoría sí.
    if (categoria === "Todas") {
      setSearchParams({});
    } else {
      setSearchParams({ categoria });
    }
  }

  function handleAgregar(producto) {
    agregarAlCarrito(producto); 
    // Misma confirmación visual de 1 segundo que tenía la versión HTML,
    // pero usando estado de React en vez de boton.textContent = "...".
    setAgregados((anterior) => ({ ...anterior, [producto.id]: true }));
    setTimeout(() => {
      setAgregados((anterior) => ({ ...anterior, [producto.id]: false }));
    }, 1000);
  }

  return (
    <main>
      <h1 className="section-title-productos">Catálogo de productos</h1>

      <section className="search-section">
        <input
          type="text"
          className="input-buscar"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
        {/* El filtrado ya ocurre en vivo con cada tecla (como antes),
            este botón queda solo como apoyo visual, igual que en el
            original (ahí tampoco hacía falta hacer clic para filtrar). */}
        <button type="button" className="search-button">Buscar</button>
      </section>

      <section className="categorias-filtro">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            className={`categoria-pill ${categoriaActiva === categoria ? "activa" : ""}`}
            onClick={() => handleFiltrarCategoria(categoria)}
          >
            {categoria}
          </button>
        ))}
      </section>

      {error && <p className="aviso-simulacion">⚠️ {error}</p>}

      <section className="catalogo-grid">
        {cargando && <p className="sin-resultados">Cargando catálogo...</p>}

        {!cargando && productosFiltrados.length === 0 && (
          <p className="sin-resultados">No se encontraron productos.</p>
        )}

        {productosFiltrados.map((producto) => (
          // "key" es obligatorio cuando se genera una lista con .map():
          // le permite a React identificar cada tarjeta entre un render
          // y el siguiente, en vez de repintar todo el grid de cero.
          <article className="product-item" key={producto.id}>
            <Link to={`/productos/${producto.id}`} className="producto-link">
              <div className="producto-icono">{producto.icono}</div>
              <p className="producto-categoria">{producto.categoria}</p>
              <h3>{producto.nombre}</h3>
            </Link>
            <p className="producto-precio">{formatearPrecioCLP(producto.precio)}</p>
            <p className={`producto-stock ${producto.disponible ? "disponible" : "agotado"}`}>
              {producto.disponible ? "En stock" : "Agotado"}
            </p>

            {producto.disponible ? (
              <button
                type="button"
                className="carrito-button"
                onClick={() => handleAgregar(producto)}
              >
                {agregados[producto.id] ? "¡Agregado! ✓" : "Agregar al carrito"}
              </button>
            ) : (
              <button type="button" className="carrito-button" disabled>
                Agotado
              </button>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
