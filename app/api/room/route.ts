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

  if (!user) return NextResponse.json("Unauthenticated", { status: 401 });
  

  try {
    const room = await prismaClient.room.create({
      data: {
        roomId,
        creatorId: user.id,
      },
    });
    console.log("room id", room.roomId);
    return NextResponse.json({
      status: 200,
      message: "Room Created",
      room,
      isCreator: true,
    });
  } catch (err) {
    console.log(err);
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
  if (!user) return NextResponse.json("Unauthenticated", { status: 401 });

  const roomId = req.nextUrl.searchParams.get("roomId") || "";
  try {
    const room = await prismaClient.room.findFirst({
      where: {
        roomId: roomId,
      },
    });
    console.log("Here is the room id", roomId);
    if (!roomId || !room)
      return NextResponse.json({ message: "Invalid room id ", status: 403 });

    const isAdmin = room.creatorId === user.id;

    return NextResponse.json({ room, isAdmin });
  } catch (error) {
    return NextResponse.json("Could not join room", { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  if (!user) return NextResponse.json("Unauthenticated", { status: 401 });

  const id = req.nextUrl.searchParams.get("id") || "";
  try {
    await prismaClient.room.delete({
      where: {
        id,
      },
    });
    if (!id)
      return NextResponse.json({ message: "Invalid room id ", status: 403 });

    return NextResponse.json("Room Deleted", { status: 200 });
  } catch (error) {
    return NextResponse.json("Could not delete room", { status: 400 });
  }
}
