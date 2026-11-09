import { useContext } from 'react'
import { SesionContext } from '../context/sesionContexto.js'

export function useSesion() {
  return useContext(SesionContext)
}
