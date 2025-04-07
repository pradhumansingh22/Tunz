import { Appbar } from "./components/Appbar";
import Link from "next/link";
import { OpenSans } from "./lib/fonts";

export default function HomePage() {
  return (
    <div className="w-screen h-screen p-4 box-border">
      <div
        className={`${OpenSans.className} w-full h-full bg-[url('/bg.png')] bg-cover bg-center rounded-2xl`}
      >
        <Appbar></Appbar>
        <div className="pt-20 ml-20">
          <h1 className="text-[#2E3F3C] font-bold text-5xl my-2">Melodies</h1>
          <h1 className="text-[#2E3F3C] font-bold text-5xl my-2">
            that help you
          </h1>
          <h1 className="text-[#2E3F3C] font-bold text-5xl my-2">stay focus</h1>
        </div>
        <div className="bg-white flex justify-between items-center rounded-full px-4 py-5 max-w-[40%] mt-10 ml-20">
          <div className="ml-4 font-sans font-semibold text-[#2E3F3C] text-xl">
            Create Your Musical Space
          </div>
          <button className="bg-[#2E3F3C] text-white rounded-full px-6 py-2 mr-3">
            Let's Go
          </button>
        </div>
      </div>
    </div>
  );
}
