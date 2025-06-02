import { create } from "zustand";
import { persist } from "zustand/middleware";

interface roomIdStore {
  roomId: string;
  setRoomId: (roomId: string) => void;
}

export interface Song {
  id: string;
  url: string;
  extractedId: string;
  title: string;     
  smallImg: string;
  bigImg: string;
  active: boolean;
  upvotes: [];
  userId: string;
  roomId: string;
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