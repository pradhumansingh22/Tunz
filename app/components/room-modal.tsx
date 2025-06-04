"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  useIsCreator,
  useRoomIdStore,
  useRoomStore,
} from "../lib/store/myStore";
import axios from "axios";
import { useRouter } from "next/navigation";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoomModal({ isOpen, onClose }: RoomModalProps) {
  const { roomId, setRoomId } = useRoomIdStore();
  const { setRoom } = useRoomStore();
  const [joinRoomId, setjoinRoomId] = useState("");
  const [mode, setMode] = useState<"select" | "create" | "join">("select");
  const [value, setValue] = useState("");
  const router = useRouter();
  const { setIsCreator } = useIsCreator();
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    try {
      setLoading(true);
      const response = await axios.post("api/room", { roomId });
      const room = response.data.room;
      setRoom(room);
      console.log("is creator res: ", response.data.isCreator);
      setIsCreator(response.data.isCreator);
      const createdRoomId = response.data.room.id;
      router.push(`room/${createdRoomId}`);
      setLoading(false);

      onClose();
    } catch (error) {
      console.log("Some error occurred: ", error);
    }
  };

  const handleJoinRoom = async () => {
    setLoading(true);
    const response = await axios.get(`/api/room/?roomId=${joinRoomId}`);
    if (response.data.room) {
      setIsCreator(response.data.isAdmin);
      const id = response.data.room.id;
      router.push(`/room/${id}`);
      setLoading(false); //if response->status is 409, show an error msg to enter the id again as it already exists
    } else {
      console.error("Some error occured");
    }

    onClose();
  };

  const resetView = () => {
    setMode("select");
    setRoomId("");
    setjoinRoomId("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value.replace(/[-\s]/g, "");
    const formatted = rawInput.match(/.{1,3}/g)?.join("-") || "";

    setValue(formatted);
    setRoomId(formatted);
    setjoinRoomId(formatted);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onClose();
          resetView();
        }
      }}
    >
      <DialogContent className="sm:max-w-md rounded-xl bg-white">
        <DialogHeader>
          {!loading && (
            <DialogTitle className="text-[#2E3F3C] text-xl font-semibold">
              {mode === "select"
                ? "Your Musical Space"
                : mode === "create"
                ? "Create a New Room"
                : "Join an Existing Room"}
            </DialogTitle>
          )}
          {!loading && (
            <button
              onClick={() => {
                onClose();
                resetView();
              }}
              className="absolute right-4 top-4 text-[#2E3F3C] hover:text-[#2E3F3C]/80"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </DialogHeader>

        <div className="p-4">
          {mode === "select" && (
            <div className="flex flex-col gap-4">
              <p className="text-[#2E3F3C] text-sm">
                Create your own room or join an existing one to start your
                musical journey.
              </p>
              <div className="flex flex-col gap-3mt-2">
                <Button
                  onClick={() => setMode("create")}
                  className="bg-[#2E3F3C] hover:bg-[#2E3F3C]/90 rounded-lg text-white mb-2 py-2"
                >
                  Create a Room
                </Button>
                <Button
                  onClick={() => setMode("join")}
                  className="bg-white border border-[#2E3F3C] text-[#2E3F3C] py-2 rounded-lg hover:bg-gray-50"
                >
                  Join a Room
                </Button>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col py-4 px-2 justify-center items-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-12 h-12 text-gray-200 animate-spin fill-[#2E3F3C]"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          {!loading && mode === "create" && (
            <div className="flex flex-col gap-4">
              <p className="text-[#2E3F3C] text-sm">
                Create a new room and invite your friends to join your musical
                space.
              </p>
              <input
                spellCheck={false}
                placeholder="Enter a Room ID"
                value={value}
                maxLength={7}
                minLength={6}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                className="border border-gray-600 rounded-md px-2 py-2"
              />
              <div className="flex flex-col gap-3 mt-2">
                <Button
                  onClick={handleCreateRoom}
                  disabled={!joinRoomId.trim()}
                  className="bg-[#2E3F3C] hover:bg-[#2E3F3C]/90 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  Create Room
                </Button>
                <Button
                  onClick={() => setMode("select")}
                  className="bg-white border border-[#2E3F3C] text-[#2E3F3C] py-2 rounded-lg hover:bg-gray-50"
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {!loading && mode === "join" && (
            <div className="flex flex-col gap-4">
              <p className="text-[#2E3F3C] text-sm">
                Enter a room ID to join an existing musical space.
              </p>
              <input
                spellCheck={false}
                placeholder="Enter Room ID"
                value={value}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                className="px-2 py-2 border border-gray-600 rounded-md"
              />
              <div className="flex flex-col gap-3 mt-2">
                <Button
                  onClick={handleJoinRoom}
                  disabled={!roomId.trim()}
                  className="bg-[#2E3F3C] hover:bg-[#2E3F3C]/90 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  Join Room
                </Button>
                <Button
                  onClick={() => setMode("select")}
                  className="bg-white border border-[#2E3F3C] text-[#2E3F3C] py-2 rounded-lg hover:bg-gray-50"
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
