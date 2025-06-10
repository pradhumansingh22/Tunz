import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const isVercelCron = req.headers.get("x-vercel-cron");

  if (!isVercelCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const deletedRooms = await prismaClient.room.deleteMany({
    where: { createdAt: { lt: twentyFourHoursAgo } },
  });

  const resetUsers = await prismaClient.user.updateMany({
    data: {
      calls: 0,
    },
  });

  return NextResponse.json({
    message: "Rooms deleted & API call count reset",
    deletedRooms: deletedRooms.count,
    resetUsers: resetUsers.count,
  });
}
