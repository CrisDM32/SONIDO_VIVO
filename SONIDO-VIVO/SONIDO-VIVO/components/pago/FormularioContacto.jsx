export default function FormularioContacto({ formulario, onCambio, onSubmit }) {
  const regionesChile = {
    'Región de Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte'],
    'Región de Antofagasta': ['Antofagasta', 'Calama', 'Taltal'],
    'Región de Atacama': ['Copiapó', 'Vallenar', 'Caldera'],
    'Región de Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle'],
    'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'San Antonio'],
    'Región Metropolitana': ['Santiago', 'Puente Alto', 'Maipú'],
    'Región del Libertador General Bernardo O\'Higgins': ['Rancagua', 'San Fernando', 'Machalí'],
    'Región del Maule': ['Talca', 'Curicó', 'Linares'],
    'Región de Ñuble': ['Chillán', 'Bulnes', 'San Carlos'],
    'Región del Biobío': ['Concepción', 'Los Ángeles', 'Talcahuano'],
    'Región de La Araucanía': ['Temuco', 'Villarrica', 'Padre Las Casas'],
    'Región de Los Ríos': ['Valdivia', 'La Unión', 'Río Bueno'],
    'Región de Los Lagos': ['Puerto Montt', 'Osorno', 'Castro'],
    'Región de Aysén del General Carlos Ibáñez del Campo': ['Coyhaique', 'Puerto Aysén', 'Villa O\'Higgins'],
    'Región de Magallanes y de la Antártica Chilena': ['Punta Arenas', 'Puerto Natales', 'Porvenir'],
  }

  const regiones = Object.keys(regionesChile)
  const comunasDisponibles = regionesChile[formulario.region] || []

  return (
    <section className="checkout-card">
      <h2>Información personal</h2>

      <form className="checkout-form" onSubmit={onSubmit}>
        <div className="campo">
          <label htmlFor="nombre">Nombre completo</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formulario.nombre}
            onChange={onCambio}
            placeholder="Ej: María José Pérez"
            required
          />
        </div>

        <div className="campo-fila">
          <div className="campo">
            <label htmlFor="rut">RUT</label>
            <input
              id="rut"
              name="rut"
              type="text"
              value={formulario.rut}
              onChange={onCambio}
              placeholder="12.345.678-9"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={formulario.telefono}
              onChange={onCambio}
              placeholder="+56 9 1234 5678"
              required
            />
          </div>
        </div>

        <div className="campo">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={formulario.correo}
            onChange={onCambio}
            placeholder="nombre@correo.com"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            name="direccion"
            type="text"
            value={formulario.direccion}
            onChange={onCambio}
            placeholder="Calle, número, depto."
            required
          />
        </div>

        <div className="campo-fila">
          <div className="campo">
            <label htmlFor="region">Región</label>
            <select id="region" name="region" value={formulario.region} onChange={onCambio}>
              {regiones.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="comuna">Comuna</label>
            <select id="comuna" name="comuna" value={formulario.comuna} onChange={onCambio}>
              {comunasDisponibles.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="boton-principal boton-ancho-auto">
          Continuar
        </button>
      </form>
    </section>
  )
}
