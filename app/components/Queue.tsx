"use client"

import React, { RefObject } from "react";
import { Music } from "lucide-react";
import { Song } from "./roomDashboard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { QueueSong } from "./QueueSong";


type QueueProps = {
  currentQueue: Song[];
  queueScrollRef: RefObject<HTMLDivElement | null>;
};

export const Queue: React.FC<QueueProps> = ({ currentQueue, queueScrollRef }) => {
  return (
    <div className="order-3 md:order-1 md:col-span-3 border-b md:border-b-0 md:border-r border-[#2E3F3C] flex flex-col h-[40vh] sm:h-[30vh] md:h-full overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-[#2E3F3C] flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-bold text-[#2E3F3C]">
          Song Queue
        </h2>
      </div>

      <div
        ref={queueScrollRef}
        className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {currentQueue.length > 0 ? (
            <SortableContext
              strategy={verticalListSortingStrategy}
              items={currentQueue.map((song) => song.id)}
            >
              {currentQueue.map((song) => (
                <QueueSong key={song.id} song={song} />
              ))}
            </SortableContext>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-[#2E3F3C]/60">
              <Music className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
              <p className="text-sm">Queue is empty.</p>
              <p className="text-xs">Add songs to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

