import { useEffect, useState } from 'react'
import { Rutas } from '../service/endpoints.js'
import imagenProducto from '../images/producto1.png'

// El backend entrega todos los datos del producto (código, marca, modelo, descripción, precio, disponibilidad).
// Solo falta la imagen: por ahora todos los productos usan la misma imagen genérica.
const conImagen = (producto) => ({ ...producto, imagenes: [imagenProducto] })

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
        if (vigente) setResultado({ productos: datos.map(conImagen), estado: 'SUCCESS' })
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
