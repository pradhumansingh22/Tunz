import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const upvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const data = upvoteSchema.parse(body);

    await prismaClient.upvotes.create({
      data: {
        userId: user.id,
        streamId: data.streamId,
      },
    });
    return NextResponse.json({ message: "done" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { userId: user.id, message: "Error while upvoting" },
      {
        status: 403,
      }
    );
  }
}
