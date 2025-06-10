import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!session || !user) {
    return NextResponse.json("Unauthenticated", { status: 401 });
  }
  const { roomId, searchedSong, addedBy } = await req.json();
  if (!roomId || !searchedSong)
    return NextResponse.json("Invalid Room Id or Song Name", { status: 403 });

  const room = await prismaClient.room.findFirst({ where: { id: roomId } });
  if (!room) return NextResponse.json("Room not found", { status: 404 });

  const apiKey = process.env.YOUTUBE_API_KEY;
  try {
    const result = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
        searchedSong || ""
      )}&type=video&key=${apiKey}`
    );

    if (result.data.items && result.data.items.length > 0) {
      const firstResult = result.data.items[0];
      const videoId = firstResult.id.videoId;
      const title = firstResult.snippet.title;
      const bigImg = firstResult.snippet.thumbnails.high.url;
      const url = `https://www.youtube.com/watch?v=${videoId}`;

      const existingSong = room.songs.find((s) => s === videoId);
      if (existingSong) {
        return NextResponse.json("Song already exists in room", {
          status: 409,
        });
      }

      await prismaClient.room.update({
        where: { id: room.id },
        data: {
          songs: {
            push: videoId,
          },
        },
      });
      return NextResponse.json({
        message: "Added Song",
        id: crypto.randomUUID(),
        title: title,
        bigImg: bigImg,
        url,
        songId: videoId,
        addedBy,
      });
      }
      return NextResponse.json("Could not add song", { status: 400 });
      
  } catch (error) {
    console.error(error);
    return NextResponse.json("Could not add song", { status: 400 });
  }
}
