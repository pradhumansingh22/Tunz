"use client";

import { useRef, useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";

let currentlyPlayingAudio: HTMLAudioElement | null = null;
let currentlyPlayingId: string | null = null;
let setPlayingStates: Record<string, (playing: boolean) => void> = {};

export default function MusicPlayer({
  id,
  songUrl,
  songTitle,
  artist,
  songCover,
}: {
  id: string;
  songUrl: string;
  songTitle: string;
  artist: string;
  songCover: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setPlayingStates[id] = setIsPlaying;

    return () => {
      delete setPlayingStates[id];
    };
  }, [id]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      currentlyPlayingAudio = null;
      currentlyPlayingId = null;
    } else {
      if (currentlyPlayingAudio && currentlyPlayingAudio !== audioRef.current) {
        currentlyPlayingAudio.pause();
        currentlyPlayingAudio.currentTime = 0;

        if (currentlyPlayingId && setPlayingStates[currentlyPlayingId]) {
          setPlayingStates[currentlyPlayingId](false); 
        }
      }

      audioRef.current.play();
      currentlyPlayingAudio = audioRef.current;
      currentlyPlayingId = id;
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-zinc-950 text-white border-none shadow-xl rounded-lg overflow-hidden">
        <div className="relative group">
          <div className="overflow-hidden">
            <img
              src={songCover}
              onError={(e) => (e.currentTarget.src = "/music.jpg")}
              alt={`${songTitle} by ${artist}`}
              className="w-full h-auto aspect-square object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-75"
            />
          </div>

          <audio
            src={songUrl}
            ref={audioRef}
            onEnded={() => {
              setIsPlaying(false);
              currentlyPlayingAudio = null;
              currentlyPlayingId = null;
            }}
          />

          <button
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform transition-transform duration-300 hover:scale-110">
              {isPlaying ? (
                <Pause className="h-10 w-10 text-white" />
              ) : (
                <Play className="h-10 w-10 text-white" />
              )}
            </div>
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-xl font-bold truncate">{songTitle}</h2>
            <p className="text-zinc-400 truncate">{artist}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
