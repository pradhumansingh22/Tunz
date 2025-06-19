"use client";

import { useState } from "react";

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleCopy}
        className="flex items-center justify-center space-x-2 text-xs bg-[#2E3F3C] hover:bg-[#2E3F3C]/90 text-[#e3e7d7] px-1 sm:px-1 py-1 sm:py-1 rounded-3xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px] h-9 sm:h-10"
      >
        {copied ? "Copied!" : "Copy Room Id"}
      </button>
    </div>
  );
};
