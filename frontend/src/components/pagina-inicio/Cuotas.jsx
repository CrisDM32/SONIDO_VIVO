import BanderaLogo from '../../images/icono/bandera-logo.svg';

const fila = 'flex h-10 items-center justify-center gap-3'

export const Cuotas = () => {
    return (
        <section className="mt-20 mb-[100px] px-4 text-center text-[30px] mobile:mt-10 mobile:mb-12 mobile:text-[clamp(18px,4vw,24px)]">
            <div className={fila}>
                <p className="my-2"><b>Envios a todo Chile</b></p>
                <img src={BanderaLogo} alt="Bandera Chilena" className="size-[35px] mobile:size-7 mobile:flex-[0_0_28px]"></img>
            </div>
            <div className={fila}>
                <p className="my-2"><b>Paga en 12 cuotas sin Intéres!</b></p>
            </div>
        </section>
    )
}
