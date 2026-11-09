import { useEffect, useState } from 'react'
import { Rutas } from '../service/endpoints.js'
import { productos as detalles } from '../data/productos.js'
import imagenProducto from '../images/producto1.png'

// La API manda en lo que cambia desde el panel (nombre, precio, categoría, icono, disponibilidad).
// data/productos.js solo aporta lo que la BD no guarda (código, imágenes, descripción); un producto
// creado desde el panel, que no está ahí, usa valores por defecto.
function conDetalle(producto) {
  const detalle = detalles.find((d) => d.id === producto.id)

  return {
    codigo: `SV-${String(producto.id).padStart(3, '0')}`,
    descripcion: '',
    imagenes: [imagenProducto],
    ...detalle,
    ...producto,
  }
}

export const useProductos = () => {
  const [resultado, setResultado] = useState({ productos: [], estado: 'LOADING' })

  useEffect(() => {
    let vigente = true

    fetch(Rutas.productos)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error HTTP ${respuesta.status}`)
        }
        return respuesta.json()
      })
      .then((datos) => {
        if (vigente) setResultado({ productos: datos.map(conDetalle), estado: 'SUCCESS' })
      })
      .catch(() => {
        if (vigente) setResultado({ productos: [], estado: 'ERROR' })
      })

    return () => {
      vigente = false
    }
  }, [])

  return resultado
}
