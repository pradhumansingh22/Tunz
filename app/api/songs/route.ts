import { prismaClient } from "@/db/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";

const urlRegex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

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
  const { roomId, url } = await req.json();
  if (!roomId || !url)
    return NextResponse.json("Invalid Room Id or Song Url", { status: 403 });

  const isValidUrl = url.match(urlRegex);

  if (!isValidUrl) return NextResponse.json("Invalid URL", { status: 401 });

  const extractedId = url.split("?v=")[1];
  const videoDetails = await youtubesearchapi.GetVideoDetails(extractedId);
  const thumbnails = videoDetails.thumbnail.thumbnails;
  thumbnails.sort((a: { width: number }, b: { width: number }) =>
    a.width < b.width ? -1 : 1
  );

  try {
    const stream = await prismaClient.stream.create({
      data: {
        roomId: roomId,
        userId: user.id,
        url,
        extractedId,
        type: "Youtube",
        title: videoDetails.title,
        smallImg:
          thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url ??
              "https://nypost.com/wp-content/uploads/sites/2/2021/04/zoe-roth-12.jpg?quality=75&strip=all&w=744",
        bigImg:
          thumbnails[thumbnails.length - 1].url ??
          "https://nypost.com/wp-content/uploads/sites/2/2021/04/zoe-roth-12.jpg?quality=75&strip=all&w=744",
      },
    });
    return NextResponse.json({
      ...stream,
      id: stream.id,
      haveUpvoted: false,
      upvotes: 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Could not add song", { status: 400 });
  }
}
