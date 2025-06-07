"use client";

import React from "react";
import { Song } from "./roomDashboard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCurrentSongQueue } from "../lib/store/myStore";

type QueueSongProps = {
  song: Song;
};

export const QueueSong: React.FC<QueueSongProps> = ({ song }) => {
  const { attributes, listeners, setNodeRef, transition, transform } =
    useSortable({ id: song.id });

  const { setCurrentSong, setCurrentSongQueue } =
    useCurrentSongQueue();

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

    const handlePlaySong = (clickedSong: Song) => {
      console.log("Playing song:", clickedSong);
      setCurrentSong(clickedSong);
      setCurrentSongQueue((prevQueue) =>
        prevQueue.filter((song) => song.id !== clickedSong.id)
      );
      
    };
  
  
  return (
    <div
      onClick={() => {
        handlePlaySong(song);
      }}
      className="flex items-center gap-2 sm:gap-3 p-2 rounded-md hover:bg-[#2E3F3C]/10 touch-none cursor-grab active:cursor-grabbing"
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      id={song.id}
    >
      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded overflow-hidden">
        <img
          src={song.bigImg || "/placeholder.svg?height=60&width=60"}
          alt={song.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-xs sm:text-sm break-words text-[#2E3F3C]">
          {song.title}
        </h4>
        <p className="text-xs text-[#2E3F3C]/70 break-words">{song.artist}</p>
        <div className="flex justify-between text-xs text-[#2E3F3C]/60">
          <span className="truncate">{song.addedBy}</span>
          <span>{song.duration}</span>
        </div>
      </div>
    </div>
  );
};
