"use client";

import type React from "react";

import { useRef, useState } from "react";
import type { Song } from "./roomDashboard";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

interface PlayerProps {
  currentSong: Song;
  handlePlayNext: () => void;
}

export function MusicPlayer({ currentSong, handlePlayNext }: PlayerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleProgress = (progress: {
    played: number;
    playedSeconds: number;
  }) => {
    setCurrentTime(progress.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration;

    playerRef.current.seekTo(seekTime, "seconds");
    setCurrentTime(seekTime);
  };

  const handleSkipBackward = () => {
    if (!playerRef.current) return;
    const newTime = Math.max(0, currentTime - 10);
    playerRef.current.seekTo(newTime, "seconds");
    setCurrentTime(newTime);
  };

  const handleSkipForward = () => {
    if (!playerRef.current) return;
    const newTime = Math.min(duration, currentTime + 10);
    playerRef.current.seekTo(newTime, "seconds");
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <ReactPlayer
        ref={playerRef}
        url={currentSong.url}
        playing={isPlaying}
        onEnded={handlePlayNext}
        onProgress={handleProgress}
        onDuration={handleDuration}
        controls={false}
        width="0"
        height="0"
      />

      {/* Song Info */}

      {/* Progress Bar */}
      <div className="w-4/5">
        <div
          className="w-full h-1.5 bg-[#2E3F3C]/20 rounded-full cursor-pointer relative"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-[#2E3F3C] rounded-full transition-all duration-100 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#2E3F3C] rounded-full shadow-md"></div>
          </div>
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-xs text-[#2E3F3C]/70 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-0.5">
        {/* Skip Backward */}
        <button
          onClick={handleSkipBackward}
          className="text-[#2E3F3C] hover:bg-[#2E3F3C]/10 p-2 rounded-full transition-colors"
          title="Skip backward 10s"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </button>

        {/* Play/Pause */}
        {isPlaying ? (
          <button
            onClick={handlePause}
            className="text-[#2E3F3C] hover:bg-[#2E3F3C]/10 p-3 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
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
            className="text-[#2E3F3C] hover:bg-[#2E3F3C]/10 p-3 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          </button>
        )}

        {/* Skip Forward */}
        <button
          onClick={handleSkipForward}
          className="text-[#2E3F3C] hover:bg-[#2E3F3C]/10 p-2 rounded-full transition-colors"
          title="Skip forward 10s"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
