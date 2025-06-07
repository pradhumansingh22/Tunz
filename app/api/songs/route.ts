import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { search } from "youtube-search-without-api-key";


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
  const { roomId, url, addedBy } = await req.json();
  if (!roomId || !url)
    return NextResponse.json("Invalid Room Id or Song Url", { status: 403 });

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );

  if (!match) return NextResponse.json("Invalid URL", { status: 401 });

  const videoId = match[1]

  const room = await prismaClient.room.findFirst({ where: { id:roomId } });
  if (!room) return NextResponse.json("Room not found", { status: 404 });

  const existingSong = room.songs.find((s) => s === videoId);
  if (existingSong) {
    return NextResponse.json("Song already exists in room", { status: 409 });
  }

  await prismaClient.room.update({
    where: { id: room.id },
    data: {
      songs: {
        push: videoId,
      },
    },
  });


  const results = await search(videoId);
  if (!results || results.length === 0) {
    throw new Error("No results found for the given query.");
  }

   const video = results[0];
   const videoTitle = video.title;
   const bigImg =
     video.snippet.thumbnails?.high?.url ||
     "https://www.insticc.org/node/TechnicalProgram/56e7352809eb881d8c5546a9bbf8406e.png";
 

  try {
    return NextResponse.json({
      message: "Added Stream",
      id: crypto.randomUUID(),
      title: videoTitle,
      bigImg: bigImg,
      url,
      songId:videoId,
      addedBy
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Could not add song", { status: 400 });
  }
}

export async function DELETE(req:NextRequest) {
  const session = await getServerSession();
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!session || !user) {
    return NextResponse.json("Unauthenticated", { status: 401 });
  }
  const songId = req.nextUrl.searchParams.get("songId") || "";
  const roomId = req.nextUrl.searchParams.get("roomId") || "";

  const room = await prismaClient.room.findFirst({ where: { id: roomId } });
  if (!room) return NextResponse.json("Room not found", { status: 404 });

  const existingSong = room.songs.find((s) => s === songId);
  if (existingSong) {
    const updatedSongs = room.songs.filter((s) => s !== songId);
    await prismaClient.room.update({
      where: { id: roomId },
      data: {
        songs: updatedSongs,
      },
    });
    return NextResponse.json("Song deleted", { status: 200 });
  }
  return NextResponse.json({messaage:"Unable to delete song"})
}