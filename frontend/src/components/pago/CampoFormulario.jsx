export default function CampoFormulario({ id, label, type = 'text', value, onChange, placeholder, error, name, rows, children }) {
  const clase = error ? 'invalido' : ''

  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      {children ? (
        <select id={id} name={name} value={value} onChange={onChange} className={clase}>
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
          className={clase}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={clase}
        />
      )}
      {error && <small className="error">{error}</small>}
    </div>
  )
}
