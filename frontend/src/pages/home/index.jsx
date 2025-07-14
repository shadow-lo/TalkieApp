import { ArrowUpRight } from "lucide-react";
import { HeroSvg } from "../../components/svg";
import { Link } from "react-router";

function HomePage() {
  return (
    <main>
      <div className="flex max-lg:text-center items-center">
        <div className="max-w-md max-lg:mb-5">
          <div className="text-[clamp(3rem,5vw,6rem)]/[1] mb-8 max-lg:mb-2 ">
            <span className="absolute inline-block blur-xl [transform:translate3d(0,0,0)] bg-[linear-gradient(90deg,var(--color-secondary)_4%,color-mix(in_oklch,var(--color-secondary),var(--color-error))_22%,var(--color-primary)_45%,color-mix(in_oklch,var(--color-primary),var(--color-accent))_67%,var(--color-accent)_100.2%)] bg-clip-text will-change-auto [-webkit-text-fill-color:transparent] motion-reduce:tracking-normal! max-[1279px]:tracking-normal! text-[clamp(3rem,5vw,6rem)]/[1] font-extrabold text-transparent text-center select-none">
              Talkie
            </span>
            <h1 className="relative top-0 inline-block h-auto justify-center items-center [transform:translate3d(0,0,0)] bg-[linear-gradient(90deg,var(--color-secondary)_4%,color-mix(in_oklch,var(--color-secondary),var(--color-error))_22%,var(--color-primary)_45%,color-mix(in_oklch,var(--color-primary),var(--color-accent))_67%,var(--color-accent)_100.2%)] bg-clip-text will-change-auto [-webkit-text-fill-color:transparent] motion-reduce:tracking-normal! max-[1279px]:tracking-normal! text-[clamp(3rem,5vw,6rem)]/[1] font-extrabold text-transparent text-center">
              Talkie
            </h1>
            <br />
            ile hayat daha eğlenceli!
          </div>
          <p className="font-light text-[clamp(1rem,2vw,1.25rem)]/[1.2]">
            Sıradanlığa veda edip, keşfetmenin ve keyifli anlar yaşmanın tam
            zamanı. Hızlı, güvenli ve keyif dolu bir iletişim deneyimi için
            Talkie seni bekliyor. Hemen katıl, sohbetin sınırlarını kaldır!
          </p>
        </div>

        <div className="absolute left-[8%] top-[20%] max-md:hidden animate-pulse">
          <div className="w-[clamp(8rem,10vw,16rem)] aspect-square bg-secondary blur-3xl rounded-full relative opacity-70">
            <div className="w-[clamp(4rem,5vw,8rem)] aspect-square bg-error blur-3xl rounded-full absolute -right-10 -bottom-10"></div>
          </div>
        </div>
        <div className="absolute right-[8%] bottom-[20%] max-md:hidden animate-pulse">
          <div className="w-[clamp(8rem,10vw,16rem)] aspect-square bg-primary blur-3xl rounded-full relative opacity-70">
            <div className="w-[clamp(4rem,5vw,8rem)] aspect-square bg-accent blur-3xl rounded-full absolute -left-10 -bottom-10"></div>
          </div>
        </div>

        <HeroSvg className={"w-[clamp(325px,28vw,550px)] max-lg:hidden"} />
      </div>
      <div className="flex justify-center mt-[clamp(3rem,2vw,5rem)] max-lg:mt-10">
        <Link to="/talkie" replace>
          <button className="btn py-7 px-10 text-[16px] rounded-full border-none">
            Uygulamayı Aç
            <ArrowUpRight />
          </button>
        </Link>
      </div>
    </main>
  );
}

export default HomePage;
