import { Link } from 'react-router-dom'
import BannerImage from "../../images/Banner.jpeg";

export const Banner = () => {
    return (
        <section className="relative mt-[clamp(24px,5vw,60px)] flex aspect-[2067/761] items-center justify-center overflow-hidden mobile:mt-6">
            <img src={BannerImage} className="block h-full w-full object-cover object-center"></img>
            <div className="absolute right-[clamp(20px,10vw,15%)] bottom-[10%] max-w-[min(400px,80%)] -translate-y-1/2 text-center text-white mobile:right-4 mobile:bottom-3 mobile:max-w-[calc(100%_-_32px)] mobile:translate-none">
            <Link to="/productos" className="inline-block rounded-lg bg-button px-[25px] py-3 text-[18px] text-white no-underline mobile:px-[18px] mobile:py-2.5 mobile:text-[16px]">Ver Productos</Link>
            </div>
        </section>

    )
}
