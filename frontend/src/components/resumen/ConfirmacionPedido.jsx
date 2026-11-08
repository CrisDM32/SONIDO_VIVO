export default function ConfirmacionPedido() {
  return (
    <header className="my-6 flex items-center gap-5 rounded-xl bg-header p-7 text-paper shadow-[0_6px_18px_rgb(18_18_18/14%)] mobile:items-start mobile:gap-3.5 mobile:px-4 mobile:py-5 mini:gap-2.5 mini:px-3 mini:py-[18px]">
      <span
        className="grid size-[58px] flex-[0_0_58px] place-items-center rounded-full border-2 border-paper text-[32px] font-bold mobile:size-11 mobile:basis-11 mobile:text-[24px] mini:size-[38px] mini:basis-[38px] mini:text-[20px]"
        aria-hidden="true"
      >
        ✓
      </span>
      <div>
        <p className="m-0 mb-1.5 text-[14px] font-bold tracking-[0.08em] text-[#d5d1d1] uppercase">Pedido confirmado</p>
        <h1 className="m-0 text-[clamp(26px,5vw,38px)] mini:text-[25px]">¡Gracias por tu compra!</h1>
        <p className="mt-2 mb-0 text-[#e1dede]">Tu pedido fue registrado correctamente.</p>
      </div>
    </header>
  )
}
