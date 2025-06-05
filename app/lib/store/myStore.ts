import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Song } from "@/app/components/roomDashboard";


interface roomIdStore {
  roomId: string;
  setRoomId: (roomId: string) => void;
}

export interface room {
  id: string;
  creatorId: string;
  roomId: string;
  messages: string[];
  streams: Song[];
}

interface roomStore {
  room: room;
  setRoom: (room: room) => void;
}

interface isCreator {
  isCreator: boolean;
  setIsCreator: (isCreator: boolean) => void;
}


export const useRoomIdStore = create<roomIdStore>((set) => ({
  roomId: "",
  setRoomId: (roomId) => set({ roomId }),
}));

export const useRoomStore = create<roomStore>((set) => ({
  room: {
    id: "",
    creatorId: "",
    roomId: "",
    messages: [],
    streams: [],
  },
  setRoom: (room) => set({ room }),
}));

export const useIsCreator = create<isCreator>()(
  persist(
    (set) => ({
      isCreator: false,
      setIsCreator: (isCreator: boolean) => set({ isCreator }),
    }),
    {
      name: "isCreator-store",
    }
  )
);

interface CurrentQueueStore {
  currentSongQueue: Song[];
  currentSong: Song;
  setCurrentSongQueue: (queue: Song[] | ((prev: Song[]) => Song[])) => void;
  setCurrentSong: (song: Song) => void;
  resetCurrentSongQueue: () => void;
}

export const useCurrentSongQueue = create<CurrentQueueStore>()(
  persist(
    (set, get) => ({
      currentSongQueue: [],
      currentSong: {
        id: "0",
        title: "Never Gonna Give You Up",
        artist: "Rick Astley",
        duration: "4:32",
        addedBy: "Bombardino Crocodilo",
        bigImg:
          "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDX3LgTmArIBIk6uvvz4y5p95MOcg",
        likes: 7,
        likedByMe: true,
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },

      setCurrentSongQueue: (queueOrFn) => {
        const currentQueue = get().currentSongQueue;
        const nextQueue =
          typeof queueOrFn === "function" ? queueOrFn(currentQueue) : queueOrFn;
        set({ currentSongQueue: nextQueue });
      },

      setCurrentSong: (song) => set({ currentSong: song }),
      resetCurrentSongQueue: () =>
        set({
          currentSong: {
            id: "0",
            title: "Never Gonna Give You Up",
            artist: "Rick Astley",
            duration: "4:32",
            addedBy: "Bombardino Crocodilo",
            bigImg:
              "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDX3LgTmArIBIk6uvvz4y5p95MOcg",
            likes: 7,
            likedByMe: true,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
          currentSongQueue: [],
        }),
    }),
    {
      name: "current-song-queue",
    }
  )
);

