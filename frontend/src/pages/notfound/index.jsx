import { Link } from "react-router";
import { NotFoundSvg } from "../../components/svg";

function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <NotFoundSvg />
      <h2 className="text-5xl text-center mt-10">
        Uzay boşluğu gibi… Bu sayfa da sonsuz karanlıkta kaybolmuş!🛰️🔍
      </h2>
      <Link to="/" replace>
        <button className="btn py-7 px-10 text-[16px] border-none mt-3 rounded-full">
          Geri Dön
        </button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
