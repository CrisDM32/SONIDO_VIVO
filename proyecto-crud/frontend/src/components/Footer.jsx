const Footer = () => {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 text-sm text-stone-500 sm:grid-cols-3">
        <div>
          <p className="font-medium text-stone-800">Almacén</p>
          <p className="mt-1">Inventario de productos.</p>
        </div>
        <div>
          <p className="font-medium text-stone-800">Secciones</p>
          <p className="mt-1">Productos</p>
          <p>Categorías</p>
          <p>Reportes</p>
        </div>
        <div>
          <p className="mt-1">Pie de página de ejemplo.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
