import MusicPlayer from "./ui/music-player";

export const Featured = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between px-20 py-10 gap-10 w-full">
      {/* Left: Music Cards - take more space */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-[3]">
        <MusicPlayer
          id="song-1"
          songCover="doubletake.jpg"
          songTitle="Double Take"
          artist="Dhruv"
          songUrl="/audio/doubletake.mp3"
        />
        <MusicPlayer
          id="song-2"
          songCover="miamor.jpg"
          songTitle="Mi Amor"
          artist="40k, Sharn, and The Paul"
          songUrl="/audio/miamor.mp3"
        />
        <MusicPlayer
          id="song-3"
          songCover="jalalobilalo.jpg"
          songTitle="Jalalo Bilalo"
          artist="Rahein Gharana"
          songUrl="/audio/jalalobilalo.mp3"
        />
      </div>

      {/* Right: Weekly Popular - take less space */}
      <div className="flex-[1] max-w-xs mt-6 lg:mt-0">
        <h2 className="text-2xl font-semibold text-zinc-800 mb-6">
          Featured Songs
        </h2>
        <ol className="space-y-6 text-zinc-700 mb-4">
          <li className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-zinc-300 text-lg font-bold">
              1
            </div>
            <div>
              <p className="font-semibold">Double Take</p>
              <p className="text-sm text-zinc-500">1,080,000,000 played</p>
            </div>
          </li>
        </ol>
        <ol className="space-y-6 text-zinc-700 mb-4">
          <li className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-zinc-300 text-lg font-bold">
              2
            </div>
            <div>
              <p className="font-semibold">Mi Amor</p>
              <p className="text-sm text-zinc-500">241,854,550 played</p>
            </div>
          </li>
        </ol>
        <ol className="space-y-6 text-zinc-700">
          <li className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-zinc-300 text-lg font-bold">
              3
            </div>
            <div>
              <p className="font-semibold">Jalalo Bilalo</p>
              <p className="text-sm text-zinc-500">19,23,812 played</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};
