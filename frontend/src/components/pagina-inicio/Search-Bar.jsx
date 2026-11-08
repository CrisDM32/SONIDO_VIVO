import { inputBuscar } from '../../styles/clases.js'

export const SearchBar = () => {
  return (
    <section className="my-[5%] flex items-center justify-center bg-page px-4 py-[5px] mobile:my-7">
        <input type="text" placeholder="Buscar productos..." className={inputBuscar}></input>
        <a href="buscar-producto" type="button" className="flex h-10 w-[100px] items-center justify-center rounded-sv bg-button text-[100%] text-white no-underline mobile:w-[84px] mobile:flex-[0_0_84px] mobile:text-[15px]">Buscar</a>
    </section>
    )
}
