"use client";

import { useParams } from "next/navigation";

export default function RoomPage() {
  const params = useParams();
  const createdRoomId = params.roomId;
  return <div>{createdRoomId}</div>;
}
