"use client";

import { useRef, useState } from "react";
import { Song } from "./roomDashboard";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

interface PlayerProps {
  currentSong: Song;
}

export function MusicPlayer({
  currentSong
}: PlayerProps) {
  const playerRef = useRef<typeof ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlay = () => {
    setIsPlaying(true);
  };
  const handlePause = () => {
    setIsPlaying(false);
  };


  return (
    <div className="flex flex-col items-center justify-center w-full">
      <ReactPlayer
        ref={playerRef}
        url={currentSong.url}
        playing={isPlaying}
        controls={false}
        width="0"
        height="0"
      />
      <div className="flex gap-2 mt-2">
        {isPlaying ? (
          <button
            onClick={handlePause}
            className="ext-[#2E3F3C] hover:border  px-4 py-1.5 text-sm rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="text-[#2E3F3C] hover:border px-4 py-1.5 text-sm rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
