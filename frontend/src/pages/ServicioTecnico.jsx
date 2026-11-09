import { Link } from 'react-router-dom'
import { servicioTecnico } from '../data/servicioTecnico.js'
import TarjetaServicio from '../components/servicio-tecnico/TarjetaServicio.jsx'
import InformacionNecesaria from '../components/servicio-tecnico/InformacionNecesaria.jsx'
import PasosNumerados from '../components/generales/PasosNumerados.jsx'
import BloqueContacto from '../components/generales/BloqueContacto.jsx'
import { contenedorAncho, enlaceSubrayado, tituloPagina } from '../styles/clases.js'

export default function ServicioTecnico() {
  return (
    <main className={`${contenedorAncho} pb-10`}>
      <h1 className={tituloPagina}>Servicio técnico</h1>
      <p className="mt-0 mb-8 text-center text-[18px] text-[#2a2a2a]">{servicioTecnico.introduccion}</p>

      <section aria-labelledby="servicio-que-revisamos">
        <h2 id="servicio-que-revisamos" className="mt-0 mb-3 text-[28px] text-ink mobile:text-[24px]">
          ¿Qué revisamos?
        </h2>
        <div className="grid grid-cols-2 gap-4 mobile:grid-cols-1">
          {servicioTecnico.servicios.map((servicio) => (
            <TarjetaServicio
              key={servicio.titulo}
              titulo={servicio.titulo}
              descripcion={servicio.descripcion}
              icono={servicio.icono}
            />
          ))}
        </div>
      </section>

      <PasosNumerados titulo="¿Cómo solicitar el servicio?" pasos={servicioTecnico.pasos} />
      <InformacionNecesaria items={servicioTecnico.informacion} />

      <BloqueContacto className="mt-8" titulo="¿Necesitas servicio técnico?" />
      <p className="mt-4 mb-0 text-center text-[#2a2a2a]">
        {servicioTecnico.notaBloque}{' '}
        <Link to="/garantia" className={enlaceSubrayado}>
          Ver garantía
        </Link>
      </p>
    </main>
  )
}
