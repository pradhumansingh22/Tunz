import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//@ts-expect-error fhgfgh
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";
const urlRegex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = createStreamSchema.parse(await req.json());
    const isYt = data.url.match(urlRegex);
    if (!isYt) {
      return NextResponse.json(
        { message: "Invalid url format" },
        { status: 411 }
      );
    }

    const extractedId = data.url.split("?v=")[1];
    const videoDetails = await youtubesearchapi.GetVideoDetails(extractedId);
    const thumbnails = videoDetails.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );
    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title: videoDetails.title ?? "Pta nhi bhai",
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
    console.log(error);
    return NextResponse.json(
      { message: "Error while creating a stream" },
      { status: 411 }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
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
  if (!creatorId) {
    return NextResponse.json(
      {
        message: "Could not find creatorId",
      },
      { status: 411 }
    );
  }
  const streams = await prismaClient.stream.findMany({
    where: {
      userId: creatorId,
    },
    include: {
      _count: {
        select: {
          upvotes: true,
        },
      },
      upvotes: {
        where: {
          userId: user.id,
        },
      },
    },
  });

  return NextResponse.json({
    streams: streams.map(({ _count, ...rest }) => ({
      ...rest,
      upvotes: _count.upvotes,
      haveUpvoted: rest.upvotes.length ? true : false,
    })),
  });
}

export async function DELETE(req: NextRequest) {
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
    const streamId = req.nextUrl.searchParams.get("streamId");
    console.log(streamId);
    if (!streamId) {
      return NextResponse.json(
        { message: "Stream id not found" },
        { status: 411 }
      );
    }

    await prismaClient.stream.delete({
      where: {
        id: streamId,
      },
    });
    return NextResponse.json({ Message: "Video deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "could not delete stream" },
      { status: 411 }
    );
  }
}
