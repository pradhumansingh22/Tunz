import { Appbar } from "./components/Appbar";
import { OpenSans } from "./lib/fonts";
import { getServerSession } from "next-auth";
import { JoinButton } from "./components/JoinButton";
import { Featured } from "./components/featured";

export default async function HomePage() {
  const session = await getServerSession();

  return (
    <div className="overflow-x-hidden">
      <div className="p-2 sm:p-4 box-border">
        <div
          className={`${OpenSans.className} relative w-full min-h-screen bg-[url('/bg.png')] bg-cover bg-center rounded-lg sm:rounded-2xl`}
        >
          <Appbar />

          <div className="pt-8 sm:pt-12 md:pt-16 lg:pt-20 px-4 sm:px-8 md:px-12 lg:px-20 pb-36 sm:pb-0">
            <div className="max-w-4xl">
              <h1 className="text-[#2E3F3C] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl my-1 sm:my-2 leading-tight">
                Melodies
              </h1>
              <h1 className="text-[#2E3F3C] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl my-1 sm:my-2 leading-tight">
                that help you
              </h1>
              <h1 className="text-[#2E3F3C] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl my-1 sm:my-2 leading-tight">
                stay focus
              </h1>

              <div className="mt-4 sm:mt-6 space-y-1 hidden sm:block">
                <p className="text-[#2E3F3C] text-sm md:text-base font-semibold leading-relaxed">
                  Create your own room, invite your friends,
                </p>
                <p className="text-[#2E3F3C] text-sm md:text-base font-semibold leading-relaxed">
                  and vibe together as everyone adds their favorite tracks
                </p>
                <p className="text-[#2E3F3C] text-sm md:text-base font-semibold leading-relaxed">
                  to the queue. Whether you're hosting a party, chilling with
                </p>
                <p className="text-[#2E3F3C] text-sm md:text-base font-semibold leading-relaxed">
                  your crew, or discovering new beats, TunZ turns every room
                  into a
                </p>
                <p className="text-[#2E3F3C] text-sm md:text-base font-semibold leading-relaxed">
                  shared sonic experience.
                </p>
              </div>
            </div>

            <div className="hidden sm:flex bg-white flex-col sm:flex-row justify-between items-center rounded-2xl sm:rounded-full px-4 sm:px-6 py-4 sm:py-3 w-full sm:w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] mt-10 sm:mt-12 md:mt-16 gap-3 sm:gap-4">
              <div className="font-sans font-semibold text-[#2E3F3C] text-sm sm:text-base md:text-lg lg:text-xl leading-tight text-center sm:text-left sm:flex-1">
                Find or Create Your Own Musical Space
              </div>
              <div className="flex-shrink-0">
                <JoinButton isLoggedIn={!!session} />
              </div>
            </div>
          </div>

          <div className="sm:hidden absolute bottom-6 left-4 right-4 z-10">
            <div className="bg-white flex flex-col items-center justify-center text-center rounded-2xl px-4 py-4 gap-3 shadow-lg">
              <div className="font-sans font-semibold text-[#2E3F3C] text-sm leading-tight">
                Find or Create Your Own Musical Space
              </div>
              <JoinButton isLoggedIn={!!session} />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 mt-6 sm:mt-8">
        <div className="text-[#2E3F3C] text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
          Featured Music
        </div>
        <Featured />
      </div>
    </div>
  );
}
