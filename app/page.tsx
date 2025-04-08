import { redirect } from "next/navigation";
import { Appbar } from "./components/Appbar";
import { OpenSans } from "./lib/fonts";
import { getServerSession } from "next-auth";
import { JoinButton } from "./components/JoinButton";
import MusicPlayer from "./components/ui/music-player";
import { Featured } from "./components/featured";

export default async function HomePage() {
  const session = await getServerSession();

  return (
    <div className="overflow-x-hidden">
      <div className="h-screen p-4 box-border">
        <div
          className={`${OpenSans.className} w-full h-full bg-[url('/bg.png')] bg-cover bg-center rounded-2xl`}
        >
          <Appbar />
          <div className="pt-20 ml-20">
            <h1 className="text-[#2E3F3C] font-bold text-5xl my-2">Melodies</h1>
            <h1 className="text-[#2E3F3C] font-bold text-5xl my-2">
              that help you
            </h1>
            <h1 className="text-[#2E3F3C] font-bold text-5xl my-2">
              stay focus
            </h1>
            <p className="text-[#2E3F3C] text-xs font-semibold">
              Create your own room, invite your friends,
            </p>
            <p className="text-[#2E3F3C] text-xs font-semibold">
              and vibe together as everyone adds their favorite tracks
            </p>
            <p className="text-[#2E3F3C] text-xs font-semibold">
              to the queue. Whether you're hosting a party, chilling with
            </p>
            <p className="text-[#2E3F3C] text-xs font-semibold">
              your crew, or discovering new beats, TunZ turns every room into a
            </p>
            <p className="text-[#2E3F3C] text-xs font-semibold">
              shared sonic experience.
            </p>
          </div>
          <div className="bg-white flex justify-between items-center rounded-full px-4 py-5 w-[90%] sm:max-w-[40%] mt-8 ml-20">
            <div className="ml-4 font-sans font-semibold text-[#2E3F3C] text-xl">
              Create Your Musical Space
            </div>
            <JoinButton isLoggedIn={!!session} />
          </div>
        </div>
      </div>
      <div className="text-[#2E3F3C] text-xl font-semibold ml-20 mt-5">Featured Music</div>
      <Featured/>
    </div>
  );
}
