import { useEffect, useState } from 'react'
import { Rutas } from '../service/endpoints.js'
import { fotoDeProducto } from '../data/fotosProductos.js'

function conImagen(producto) {
  const foto = fotoDeProducto(producto)
  return { ...producto, imagenes: foto ? [foto] : [] }
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
