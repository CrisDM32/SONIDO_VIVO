import { useState } from "react";
import { productos } from "../data/productos";
import { agregarAlCarrito, formatearPrecioCLP } from "../utils/carrito";

export default function Productos() {
  const [busqueda, setBusqueda] = useState("");

  const [agregados, setAgregados] = useState({});

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  function handleAgregar(producto) {
    agregarAlCarrito(producto); 
    // Misma confirmación visual de 1 segundo que tenía la versión HTML,
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

      <section className="catalogo-grid">
        {productosFiltrados.length === 0 && (
          <p className="sin-resultados">No se encontraron productos.</p>
        )}

        {productosFiltrados.map((producto) => (
          // "key" es obligatorio cuando se genera una lista con .map():
            <div className="producto-icono">{producto.icono}</div>
            <p className="producto-categoria">{producto.categoria}</p>
            <h3>{producto.nombre}</h3>
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
