"use client";

import { useState, useEffect } from "react";
import { Share2 } from "lucide-react";

interface ShareStreamButtonProps {
  streamUrl: string;
  title?: string;
}

export default function ShareStreamButton({
  streamUrl,
  title = "Check out my stream!",
}: ShareStreamButtonProps) {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: streamUrl,
        });
        console.log("Stream link shared successfully");
      } catch (error) {
        console.error("Error sharing stream link:", error);
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.value = streamUrl;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("Stream link copied to clipboard!");
  };

  return (
    <button onClick={handleShare} className="flex items-center px-2 gap-2 bg-purple-600 text-white rounded-lg">
      <Share2 className="w-4 h-4" />
      {canShare ? "Share Stream" : "Copy Stream Link"}
    </button>
  );
}