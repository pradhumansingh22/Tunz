import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { search } from "youtube-search-without-api-key";


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
  const results = await search(extractedId);
  if (!results || results.length === 0) {
    throw new Error("No results found for the given query.");
  }

   const video = results[0];
   const videoTitle = video.title;
   const bigImg =
     video.snippet.thumbnails?.high?.url ||
     "https://www.insticc.org/node/TechnicalProgram/56e7352809eb881d8c5546a9bbf8406e.png";
 

  try {
    const stream = await prismaClient.stream.create({
      data: {
        roomId: roomId,
        userId: user.id,
        url,
        extractedId,
        type: "Youtube",
        id: crypto.randomUUID(),
        title: videoTitle,
        bigImg: bigImg,
      },
    });
    
    return NextResponse.json({
      ...stream,
      id: stream.id,
      haveUpvoted: false,
      upvotes: 0,
      message: "Added Stream",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Could not add song", { status: 400 });
  }
}
