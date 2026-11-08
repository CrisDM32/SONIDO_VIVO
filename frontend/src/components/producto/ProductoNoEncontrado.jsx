export default function ProductoNoEncontrado() {
  return (
    <>
      <h1 className="section-title-productos">Producto no encontrado</h1>
      <p className="producto-vacio">
        El producto que buscas no existe.{' '}
        <a href="productos.html">Volver a productos</a>
      </p>
    </>
  )
}
