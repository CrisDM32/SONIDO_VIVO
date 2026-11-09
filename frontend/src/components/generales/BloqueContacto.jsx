import { Link } from 'react-router-dom'
import { enlaceSubrayado, tarjetaClara } from '../../styles/clases.js'

export default function BloqueContacto({ titulo, nota, className = '' }) {
  return (
    <aside className={`${className} ${tarjetaClara} p-7 text-center text-ink mobile:px-4 mobile:py-5`}>
      <h2 className="mt-0 mb-2 text-[22px]">{titulo}</h2>
      <p className="m-0">
        Escríbenos desde{' '}
        <Link to="/contacto" className={enlaceSubrayado}>
          Contacto
        </Link>{' '}
        o al correo{' '}
        <a href="mailto:contacto@sonidovivo.cl" className={enlaceSubrayado}>
          contacto@sonidovivo.cl
        </a>
        .
      </p>
      {nota && <p className="mt-3 mb-0 text-[14px] text-[#555]">{nota}</p>}
    </aside>
  )
}
