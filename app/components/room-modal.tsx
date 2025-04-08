"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoomModal({ isOpen, onClose }: RoomModalProps) {
  const [roomId, setRoomId] = useState("");
  const [createRoomId, setCreateRoomId] = useState("");
  const [mode, setMode] = useState<"select" | "create" | "join">("select");

  const handleCreateRoom = () => {
    // Handle room creation logic here
    console.log("Creating new room with ID:", createRoomId);
    onClose();
  };

  const handleJoinRoom = () => {
    // Handle room joining logic here
    console.log("Joining room with ID:", roomId);
    onClose();
  };

  const resetView = () => {
    setMode("select");
    setRoomId("");
    setCreateRoomId("");
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
          <DialogTitle className="text-[#2E3F3C] text-xl font-semibold">
            {mode === "select"
              ? "Your Musical Space"
              : mode === "create"
              ? "Create a New Room"
              : "Join an Existing Room"}
          </DialogTitle>
          <button
            onClick={() => {
              onClose();
              resetView();
            }}
            className="absolute right-4 top-4 text-[#2E3F3C] hover:text-[#2E3F3C]/80"
          >
            <X className="h-4 w-4" />
          </button>
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

          {mode === "create" && (
            <div className="flex flex-col gap-4">
              <p className="text-[#2E3F3C] text-sm">
                Create a new room and invite your friends to join your musical
                space.
              </p>
              <input
                placeholder="Enter a Room ID"
                value={createRoomId}
                onChange={(e) => setCreateRoomId(e.target.value)}
                className="border border-gray-600 rounded-md px-2 py-2"
              />
              <div className="flex flex-col gap-3 mt-2">
                <Button
                  onClick={handleCreateRoom}
                  disabled={!createRoomId.trim()}
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

          {mode === "join" && (
            <div className="flex flex-col gap-4">
              <p className="text-[#2E3F3C] text-sm">
                Enter a room ID to join an existing musical space.
              </p>
              <input
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
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
