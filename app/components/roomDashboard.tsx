"use client";

import { useEffect, useState } from "react";
import { Heart, Music, Send, SkipForward } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { LoadingButton } from "./ui/loader";
import { MusicPlayer } from "./musicPlayer";
import axios from "axios";


export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  addedBy: string;
  bigImg: string;
  likes: number;
  likedByMe: boolean;
  url: string;
}

interface ChatMessage {
  user: string;
  message: string;
  time: Date | string;
}

export default function MusicRoomDashboard() {
  const params = useParams();
  const roomId = params?.roomId;
  const session = useSession();
  const userName = session.data?.user?.name;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [songLink, setSongLink] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [songQueue, setSongQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song>({
    id: "0",
    title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA",
    artist: "Karan Aujla",
    duration: "4:32",
    addedBy: "Jhon",
    bigImg:
      "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
    likes: 7,
    likedByMe: true,
    url: "https://www.youtube.com/watch?v=XTp5jaRU3Ws",
  });

  useEffect(() => {
    const getData = async () => {
      const [chatResponse, songResponse] = await Promise.all([
        axios.get(`http://localhost:8080/room/${roomId}/messages`),
        axios.get(`http://localhost:8080/room/${roomId}/songs`),
      ]);

      if (chatResponse.data.errors || songResponse.data.error) {
        console.error("an error occurred");
      }

      setChatMessages((prev) => [...prev, ...chatResponse.data.messages]);
      setSongQueue((prev) => [...prev, ...songResponse.data.songs]);
    };
    getData();

    const newSocket = new WebSocket("ws://localhost:8080");
    newSocket.onopen = () => {
      console.log("Connection established to the WebSocket server.");
      newSocket.send(
        JSON.stringify({
          type: "join",
          roomId: roomId,
        })
      );
    };

    newSocket.onmessage = (message) => {
      const parsed = JSON.parse(message.data);
      switch (parsed.type) {
        case "chat":
          setChatMessages((prev) => [...prev, parsed.messageData]);
          break;

        case "addSong":
          console.log("Song Data:", parsed.messageData);
          setSongQueue((prev) => [...prev, parsed.messageData]);
          break;

        case "songQueue":
          // What the heck am I supposed to do here
          // Handle showing the new Queue
          break;
        
        case "playNext":
          console.log("playing next song");
          handlePlayNext();
          break;
      }
    };
    setSocket(newSocket);
    return () => {
      newSocket.close();
      setSocket(null);
    };
  }, [roomId]);

  const handleAddSong = async () => {
    if (!songLink.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post("/api/songs", {
        roomId: roomId,
        url: songLink,
        addedBy: userName,
      });
      setSongQueue((prevQueue) => {
        if (prevQueue.length === 0) return prevQueue;
        console.log("hi");

        const sortedQueue = [...prevQueue].sort((a, b) => b.likes - a.likes);
        const nextSong = sortedQueue[0];

        setCurrentSong(nextSong);

        return prevQueue.filter((song) => song.id !== nextSong.id);
      });
      if (res.data) {
        socket?.send(
          JSON.stringify({
            type: "addSong",
            roomId,
            messageData: res.data,
          })
        );
      }
    } catch (error) {
      console.log("Error adding song", error);
    }
    setSongLink("");
    setLoading(false);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    socket?.send(
      JSON.stringify({
        type: "chat",
        roomId: roomId,
        messageData: {
          user: userName,
          message: chatMessage,
          time: new Date().toISOString(),
        },
      })
    );
    setChatMessage("");
  };


  const handlePlayNext = () => {
    console.log("hello");
    setSongQueue((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue;
      console.log("hi");

      const sortedQueue = [...prevQueue].sort((a, b) => b.likes - a.likes);
      const nextSong = sortedQueue[0];

      setCurrentSong(nextSong);

      return prevQueue.filter((song) => song.id !== nextSong.id);
    });
  };
  

  const playNextMessage = () => {
    socket?.send(JSON.stringify({
      type: "playNext",
      roomId: roomId,
      messageData: {
        message: "Play next song"
      }
    }))
  };


  const handleLikeSong = (songId: string) => {
    setSongQueue(
      songQueue.map((song) => {
        if (song.id === songId) {
          return {
            ...song,
            likes: song.likedByMe ? song.likes - 1 : song.likes + 1,
            likedByMe: !song.likedByMe,
          };
        }
        return song;
      })
    );
  };

  const formatTime = (date: Date | string) => {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sortedSongQueue = [...songQueue].sort((a, b) => b.likes - a.likes);

  return (
    <div className="w-full h-full bg-[#e3e7d7] rounded-xl overflow-hidden border border-[#2E3F3C] shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">
        {/* Queue Section - Left */}
        <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-[#2E3F3C] flex flex-col h-[40vh] sm:h-[30vh] md:h-full overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-[#2E3F3C] flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-bold text-[#2E3F3C]">
              Song Queue
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {" "}
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              {sortedSongQueue.length > 0 ? (
                sortedSongQueue.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-2 sm:gap-3 p-2 rounded-md hover:bg-[#2E3F3C]/10"
                  >
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded overflow-hidden">
                      <img
                        src={
                          song.bigImg || "/placeholder.svg?height=60&width=60"
                        }
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs sm:text-sm break-words text-[#2E3F3C]">
                        {song.title}
                      </h4>
                      <p className="text-xs text-[#2E3F3C]/70 break-words">
                        {song.artist}
                      </p>
                      <div className="flex justify-between text-xs text-[#2E3F3C]/60">
                        <span className="truncate">{song.addedBy}</span>
                        <span>{song.duration}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLikeSong(song.id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Heart
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          song.likedByMe
                            ? "fill-[#2E3F3C] text-[#2E3F3C]"
                            : "text-[#2E3F3C]"
                        }`}
                      />
                      <span className="text-[#2E3F3C]">{song.likes}</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-[#2E3F3C]/60">
                  <Music className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                  <p className="text-sm">Queue is empty.</p>
                  <p className="text-xs">Add songs to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Middle */}
        <div className="md:col-span-6 flex flex-col h-[calc(60vh-0px)] sm:h-[calc(70vh-0px)] md:h-full overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 overflow-auto">
            {/* Current Song */}
            <Card className="w-full max-w-xs sm:max-w-sm flex items-center justify-center bg-[#2E3F3C]/10 border-[#2E3F3C] rounded-md p-3 sm:p-4">
              <div className="flex flex-col items-center w-full">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-3 sm:mb-4 rounded-md overflow-hidden">
                  <img
                    src={
                      currentSong.bigImg ||
                      "/placeholder.svg?height=200&width=200"
                    }
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#2E3F3C] text-center break-words">
                  {currentSong.title}
                </h3>
                <p className="text-sm sm:text-base text-[#2E3F3C]/80 text-center">
                  {currentSong.artist}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap justify-center">
                  <p className="text-xs sm:text-sm text-[#2E3F3C]/60">
                    Added by {currentSong.addedBy}
                  </p>
                  <div className="flex items-center gap-1">
                    <Heart
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                        currentSong.likedByMe
                          ? "fill-[#2E3F3C] text-[#2E3F3C]"
                          : "text-[#2E3F3C]"
                      }`}
                    />
                    <span className="text-xs text-[#2E3F3C]">
                      {currentSong.likes}
                    </span>
                  </div>
                  <MusicPlayer
                    currentSong={currentSong}
                  />
                </div>
              </div>
            </Card>

            {/* Next Button */}
            <Button
              onClick={playNextMessage
              }
              className="bg-[#2E3F3C] hover:bg-[#2E3F3C]/90 text-[#e3e7d7] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md flex items-center text-sm sm:text-base"
            >
              <SkipForward className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              PLAY NEXT
            </Button>

            {/* Add Song Input */}
            <div className="w-full max-w-md flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Paste the yt link here..."
                value={songLink}
                onChange={(e) => setSongLink(e.target.value)}
                className="bg-white border-[#2E3F3C] focus-visible:ring-[#2E3F3C] focus-visible:ring-1 rounded-md px-3 py-1.5 sm:py-2 w-full text-sm"
              />
              <LoadingButton onClick={handleAddSong} loading={loading}>
                Add Song
              </LoadingButton>
            </div>
          </div>
        </div>

        {/* Chat Section - Right */}
        <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-[#2E3F3C] flex flex-col h-[calc(60vh-0px)] sm:h-[calc(70vh-0px)] md:h-full overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-[#2E3F3C] flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-bold text-[#2E3F3C]">
              Room Chat
            </h2>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {chatMessages.length > 0 ? (
                  [...chatMessages].reverse().map((msg, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                          <AvatarFallback className="bg-[#2E3F3C] text-[#e3e7d7] text-xs">
                            {msg.user ? msg.user.charAt(0) : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-xs sm:text-sm text-[#2E3F3C]">
                          {msg.user}
                        </span>
                        <span className="text-[10px] sm:text-xs text-[#2E3F3C]/60">
                          {msg.time ? formatTime(msg.time) : "??:??"}
                        </span>
                      </div>
                      <p className="ml-7 sm:ml-8 text-xs sm:text-sm mt-0.5 sm:mt-1 text-[#2E3F3C]/80 break-words">
                        {msg.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-[#2E3F3C]/60">
                    <Send className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs">Start the conversation</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Input */}
          <div className="p-3 sm:p-4 border-t border-[#2E3F3C] flex gap-2 flex-shrink-0">
            <Input
              placeholder="Type message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="bg-white border-[#2E3F3C] focus-visible:ring-[#2E3F3C] focus-visible:ring-1 px-2 py-1.5 sm:py-2 w-full text-sm rounded-md"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-[#2E3F3C] hover:bg-[#2E3F3C]/90 text-[#e3e7d7] h-8 sm:h-10 w-8 sm:w-10 rounded-md flex items-center justify-center flex-shrink-0"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
