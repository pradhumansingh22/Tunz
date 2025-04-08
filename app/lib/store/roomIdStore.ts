import { create } from "zustand";

interface roomIdStore {
  roomId: string;
  setRoomId: (roomId: string) => void;
}

export interface Stream {
  id: String;
  url: String;
  extractedId: String;
  title: String;
  smallImg: String;
  bigImg: String;
  active: Boolean;
  upvotes: [];
  userId: String;
  roomId: String;
}

export interface room {
  id: String;
  creatorId: String;
  roomId: String;
  messages: string[];
  streams: Stream[];
}

interface roomStore {
  room: room;
  setRoom: (room: room) => void;
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
