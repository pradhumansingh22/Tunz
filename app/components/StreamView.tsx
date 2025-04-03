"use client";
import type React from "react";

import { useEffect, useRef, useState } from "react";
import {
  ThumbsUp,
  Music,
  Sparkles,
  Crown,
  Home,
  Settings,
  Users,
  History,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import ShareStreamButton from "../components/share";
import { usePathname} from "next/navigation";
//@ts-expect-error fghfgh
import YouTubePlayer from "youtube-player";
import Link from "next/link";

interface StreamType {
  streamId: string;
  active: boolean;
  bigImg: string;
  extractedId: string;
  haveUpvoted: boolean;
  id: string;
  smallImg: string;
  title: string;
  type: string;
  upvotes: number;
  url: string;
  userId: string;
}

export function StreamView({ creatorId }: { creatorId: string }) {
  const session = useSession();
  const [songUrl, setSongUrl] = useState("");
  const [queue, setQueue] = useState<StreamType[]>([]);
  const [loading, setLoading] = useState(false);
  const [sharableLink, setSharableLink] = useState("");
  const videoPlayerRef = useRef(null);
  const pathname = usePathname();
  const isCreator = pathname.startsWith("/dashboard");

const playingNow = async () => {
  if (queue.length === 0) return;

  const nextSong = queue.length > 1 ? queue[1] : queue[0]; 

  setQueue((prevQueue) =>
    prevQueue.length > 1 ? prevQueue.slice(1) : prevQueue
  ); 

  localStorage.setItem("playingNowURL", nextSong?.url || "");
  localStorage.setItem("playingNowTitle", nextSong?.title || "");
  localStorage.setItem("playingNowId", nextSong?.extractedId || "");

  if (queue.length > 1) {
    await axios.delete(`/api/streams?streamId=${queue[0].id}`);
  }

  await refreshStreams();
};


  useEffect(() => {
    if (typeof window !== "undefined") {
      setSharableLink(`${window.location.origin}/creator/${creatorId}`);
    }
  }, [creatorId]);

  async function refreshStreams() {
    const res = await axios.get(`/api/streams/?creatorId=${creatorId}`);
    setQueue(
      res.data.streams.sort(
        (a: StreamType, b: StreamType) => b.upvotes - a.upvotes
      )
    );
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(refreshStreams, 3000);
    return () => clearInterval(interval);
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/streams", { url: songUrl, creatorId });
      setQueue([...queue, res.data]);
      await refreshStreams();
      setSongUrl("");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: string, haveUpvoted: boolean) => {
    const updatedQueue = queue
      .map((v) =>
        v.id === id
          ? {
              ...v,
              upvotes: v.upvotes + (haveUpvoted ? -1 : 1),
              haveUpvoted: !haveUpvoted,
            }
          : v
      )
      .sort((a, b) => b.upvotes - a.upvotes);

    setQueue(updatedQueue);

    await axios.post(`/api/streams/${haveUpvoted ? "downvote" : "upvote"}`, {
      streamId: id,
    });

    await refreshStreams();
  };

  const currentSong = queue[0] || {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "No Song Playing",
  };

 
  const playingNowId = localStorage.getItem("playingNowId") || "dQw4w9WgXcQ";
  const playingNowTitle = localStorage.getItem("playingNowTitle");

  useEffect(() => {
    if (!videoPlayerRef.current) {
      return;
    }

    const player = YouTubePlayer(videoPlayerRef.current);

    player.loadVideoById(playingNowId);

    player.playVideo();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function eventHandler(event: any) {
      if (event.data === 0) {
        playingNow();
      }
    }
    player.on("stateChange", eventHandler);
    return () => {
      player.destroy();
    };
  }, [playingNowId, videoPlayerRef]);

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <Music className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-purple-400">
                  StreamTunes
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <NavLink icon={<Home className="w-4 h-4" />} text="Home" />
                <NavLink
                  icon={<Users className="w-4 h-4" />}
                  text="Community"
                />
                <NavLink
                  icon={<History className="w-4 h-4" />}
                  text="History"
                />
                <NavLink
                  icon={<Settings className="w-4 h-4" />}
                  text="Settings"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ShareStreamButton streamUrl={sharableLink} />
              {session.data?.user?.image && (
                <img
                  src={session.data.user.image || "/placeholder.svg"}
                  alt="User"
                  className="w-8 h-8 rounded-full ring-2 ring-purple-500"
                />
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8 ">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  <h2 className="text-xl font-bold text-purple-400">
                    Now Playing
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="aspect-video w-full bg-black rounded-lg overflow-hidden ring-1 ring-purple-500/20">
                    <div ref={isCreator ? videoPlayerRef : null} className="w-full h-full">No video playing</div>
                    {/* <iframe
                      width="100%"
                      height="100%"
                      src={
                        isCreator
                          ? embedUrl
                          : "https://www.youtube.com/embed/dQw4w9WgXcQ"
                      }
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    /> */}
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl text-purple-100">
                      {playingNowTitle}
                    </h3>
                  </div>
                </div>
                <div>
                  {isCreator && queue.length !=0 && (
                    <button
                      className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg font-semibold"
                      onClick={playingNow}
                    >
                      Play Next
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-purple-400">
                  Add Song
                </h2>
                <div className="flex">
                  <input
                    type="url"
                    placeholder="Paste YouTube URL here..."
                    value={songUrl}
                    onChange={(e) => setSongUrl(e.target.value)}
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-l-xl px-4 py-2"
                  />
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 rounded-r-xl text-white px-4"
                    onClick={handleSubmit}
                  >
                    <Music className="h-4 w-4 mr-2" />
                    {loading ? "Adding..." : "Add song"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-1/2">
            <Card className="bg-gray-900 border-gray-800 sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-bold text-purple-400">Queue</h2>
                </div>
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {queue.map((song, index) => (
                    <div
                      key={song.id}
                      className="group flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            song.smallImg || "https://via.placeholder.com/64"
                          }
                          alt={song.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2 bg-purple-600 rounded-full p-1">
                            <Crown className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-purple-100 truncate">
                          {song.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-300 font-bold">
                          {song.upvotes}
                        </span>
                        <Button
                          onClick={() => handleVote(song.id, song.haveUpvoted)}
                          variant={song.haveUpvoted ? "secondary" : "ghost"}
                          size="icon"
                          type="submit"
                          className={
                            song.haveUpvoted
                              ? "bg-purple-600 hover:bg-purple-700"
                              : ""
                          }
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}