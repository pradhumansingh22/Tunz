"use client";

import { useEffect, useState, useRef } from "react";
import { Send, SkipForward } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { LoadingButton } from "./ui/loader";
import { MusicPlayer } from "./musicPlayer";
import { useCurrentSongQueue, useIsCreator } from "../lib/store/myStore";
import axios from "axios";
import { Queue } from "./Queue";
import ErrorAlert from "./ui/ErrorAlert";

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
  songId: string;
}

interface ChatMessage {
  user: string;
  message: string;
  time: Date | string;
}

//Implement no of users in a room.

export default function MusicRoomDashboard() {
  const params = useParams();
  const { isCreator } = useIsCreator();
  const roomId = params?.roomId;
  const session = useSession();
  const userName = session.data?.user?.name;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [songLink, setSongLink] = useState("");
  const [searchedSong, setSearchedSong] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const {
    currentSong,
    setCurrentSong,
    currentSongQueue,
    setCurrentSongQueue,
    resetCurrentSongQueue,
  } = useCurrentSongQueue();
  const router = useRouter();

  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const joinedKey = `has-joined-${roomId}`;
    const hasJoined = localStorage.getItem(joinedKey) === "true";

    const getSongs = async () => {
      const songResponse = await axios.get(
        `https://groovehouse-server.up.railway.app/room/${roomId}/songs`
      );

      if (songResponse.data.error) {
        console.error("an error occurred");
      }
      setCurrentSongQueue(songResponse.data.songs || []);
    };
    if (!hasJoined) {
      getSongs();
      localStorage.setItem(joinedKey, "true");
    }
    //console.log("hasJoined: ", hasJoined);

    const getMessages = async () => {
      const chatResponse = await axios.get(
        `https://groovehouse-server.up.railway.app/room/${roomId}/messages`
      );
      if (chatResponse.data.error) {
        console.log("Some error occured");
      }
      setChatMessages(chatResponse.data.messages || []);
    };
    getMessages();

    const newSocket = new WebSocket("wss://groovehouse-server.up.railway.app");
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
          setCurrentSongQueue((prev) => [...prev, parsed.messageData]);
          break;
      }
    };
    setSocket(newSocket);
    return () => {
      newSocket.close();
      setSocket(null);
    };
  }, [roomId]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  // useEffect(() => {
  //   if (queueScrollRef.current) {
  //     queueScrollRef.current.scrollTop = queueScrollRef.current.scrollHeight;
  //   }
  // }, [currentSongQueue]);

  const handleAddSong = async () => {
    if (!songLink.trim()) return;
    try {
      setLinkLoading(true);
      const res = await axios.post("/api/songs", {
        roomId: roomId,
        url: songLink,
        addedBy: userName,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response.status === 409 || 401) setLinkError(true);
    } finally {
      setSongLink("");
      setLinkLoading(false);
    }
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

  const handleExitRoom = () => {
    socket?.send(
      JSON.stringify({
        type: "exit",
        roomId,
        messageData: {
          message: "Exit room",
        },
      })
    );
    localStorage.removeItem(`has-joined-${roomId}`);
    resetCurrentSongQueue();
    router.push("/");
  };

  const handlePlayNext = async () => {
    setCurrentSongQueue((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue;

      const nextSong = currentSongQueue[0];

      setCurrentSong(nextSong);

      return prevQueue.filter((song) => song.id !== nextSong.id);
    });

    try {
      const response = await axios.delete(
        `/api/songs/?roomId=${roomId}&songId=${currentSong.songId}`
      );
      if (response.status === 200) console.log("song deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchSong = async () => {
    if (!searchedSong.trim()) return;
    try {
      setSearchLoading(true);
      const res = await axios.post("/api/search", {
        roomId: roomId,
        searchedSong: searchedSong,
        addedBy: userName,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response.status === 409 || 401 || 403 || 404 || 400)
        setSearchError(true);
    } finally {
      setSearchedSong("");
      setSearchLoading(false);
    }
  };

  // const playNextMessage = () => {
  //   socket?.send(
  //     JSON.stringify({
  //       type: "playNext",
  //       roomId: roomId,
  //       messageData: {
  //         message: "Play next song",
  //       },
  //     })
  //   );
  // };

  // const handleLikeSong = (songId: string) => {
  //   setSongQueue(
  //     songQueue.map((song) => {
  //       if (song.id === songId) {
  //         return {
  //           ...song,
  //           likes: song.likedByMe ? song.likes - 1 : song.likes + 1,
  //           likedByMe: !song.likedByMe,
  //         };
  //       }
  //       return song;
  //     })
  //   );
  // };

  const formatTime = (date: Date | string) => {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log("iscreator: ", isCreator);

  return (
    <div className="w-full h-full bg-[#e3e7d7] rounded-xl overflow-auto border border-[#2E3F3C] shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-12 h-full overflow-auto">
        {/* Chat Section - Right */}
        <div className="order-1 md:order-3 md:col-span-3 border-t md:border-t-0 md:border-l border-[#2E3F3C] flex flex-col h-[calc(60vh-0px)] sm:h-[calc(70vh-0px)] md:h-full overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-[#2E3F3C] flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-bold text-[#2E3F3C]">
              Room Chat
            </h2>
          </div>

          <div className="flex-1 overflow-hidden">
            <div
              ref={chatScrollRef}
              className="h-full overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {chatMessages.length > 0 ? (
                  [...chatMessages].map((msg, index) => (
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
            </div>
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

        {/* Main Content - Middle */}
        <div className="order-2 md:col-span-6 flex flex-col h-[calc(60vh-0px)] sm:h-[calc(70vh-0px)] md:h-full overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 overflow-auto">
            {/* Current Song */}
            <Card className="w-full max-w-xs sm:max-w-sm flex items-center justify-center bg-[#2E3F3C]/10 border-[#2E3F3C] rounded-md p-3 sm:p-4">
              <div className="flex flex-col items-center w-full">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-3 sm:mb-4 rounded-md overflow-hidden">
                  <img
                    src={
                      currentSong.bigImg ||
                      "/placeholder.svg?height=200&width=200" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
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
                  {/* <div className="flex items-center gap-1">
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
                  </div> */}
                  <MusicPlayer
                    currentSong={currentSong}
                    handlePlayNext={handlePlayNext}
                  />
                </div>
              </div>
            </Card>

            {/* Next Button */}

            <Button
              onClick={handlePlayNext}
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
              <LoadingButton onClick={handleAddSong} loading={linkLoading}>
                Add Song
              </LoadingButton>
            </div>
            {linkError && (
              <ErrorAlert
                onClose={() => {
                  setLinkError(false);
                }}
                message="Invalid URL or Song already exists in the queue"
              ></ErrorAlert>
            )}
            <div className="w-full max-w-md flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter song name..."
                value={searchedSong}
                onChange={(e) => setSearchedSong(e.target.value)}
                className="bg-white border-[#2E3F3C] focus-visible:ring-[#2E3F3C] focus-visible:ring-1 rounded-md px-3 py-1.5 sm:py-2 w-full text-sm"
              />
              <LoadingButton onClick={handleSearchSong} loading={searchLoading}>
                Add Song
              </LoadingButton>
            </div>
            {searchError && (
              <ErrorAlert
                onClose={() => {
                  setSearchError(false);
                }}
                message="Song already exists in the queue or Invalid input"
              ></ErrorAlert>
            )}
          </div>
          <button onClick={handleExitRoom}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8 text-[#2E3F3C] m-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
          </button>
        </div>
        <Queue currentQueue={currentSongQueue}></Queue>
      </div>
    </div>
  );
}
