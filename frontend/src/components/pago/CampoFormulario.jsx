import {
  campo,
  campoError,
  campoEtiqueta,
  campoInput,
  campoTextarea,
} from '../../styles/clases.js'

export default function CampoFormulario({ id, label, type = 'text', value, onChange, placeholder, error, name, rows, children }) {
  const invalido = Boolean(error)

  return (
    <div className={campo}>
      <label htmlFor={id} className={campoEtiqueta}>{label}</label>
      {children ? (
        <select id={id} name={name} value={value} onChange={onChange} className={campoInput(invalido)}>
          {children}
        </select>
      ) : rows ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={campoTextarea(invalido)}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={campoInput(invalido)}
        />
      )}
      {error && <small className={campoError}>{error}</small>}
    </div>
  )
}
