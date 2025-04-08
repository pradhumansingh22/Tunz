import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  const { roomId } = await req.json();

  if (!user) return NextResponse.json("Unauthenticated", { status: 403 });

  try {
    const room = await prismaClient.room.create({
      data: {
        roomId,
        creatorId: user.id,
      },
    });
    const createdRoomId = room.id;
    return NextResponse.json({
      status: 200,
      message: "Room Created",
      createdRoomId,
      isCreator:true
    });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      message: "Error while creating room",
    });
  }
}


export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  if (!user) return NextResponse.json("Unauthenticated", { status: 403 });

  const roomId = req.nextUrl.searchParams.get("roomId") || "";
  try {
    const room = await prismaClient.room.findFirst({
      where: {
        roomId: roomId,
      },
    });
    console.log("Here is the room id", roomId);
    if (!roomId || !room)
      return NextResponse.json({ message: "Invalid room id ", status: 400 });

    const isAdmin = room.creatorId === user.id;

    return NextResponse.json({ room, isAdmin });
  } catch (error) {
    return NextResponse.json("Could not join room", { status: 400 });
  }
}

