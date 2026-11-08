const Campo = ({ id, etiqueta, children }) => {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-800">
        {etiqueta}
      </label>
      {children}
    </div>
  )
}

export default Campo
