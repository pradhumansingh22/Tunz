"use client";

import { useRoomStore } from "@/app/lib/store/roomIdStore";
import { useParams } from "next/navigation";

export default function RoomPage() {
  const { room } = useRoomStore();
  return (
    <div>
      <div>{room.id}</div>
      <div>{room.creatorId}</div>
      <div>{room.roomId}</div>
    </div>
  );
}
