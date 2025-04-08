import { create } from "zustand";

interface roomIdStore {
  roomId: string;
  setRoomId: (roomId: string) => void;
}

export const useRoomIdStore = create<roomIdStore>((set) => ({
  roomId: "",
  setRoomId: (roomId) => set({ roomId }),
}));
