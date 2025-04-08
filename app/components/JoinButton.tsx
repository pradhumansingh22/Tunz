"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { RoomModal } from "./room-modal";
import { useState } from "react";

export function JoinButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    isLoggedIn ? setIsOpen(true) : router.push("/api/auth/signin")
  }
  return (
    <div>
      <Button
        className="bg-[#2E3F3C] text-white rounded-full px-6 py-2 mr-3 hover:bg-[#69a197] transition duration-300"
        onClick={handleClick}
      >
        Let's Go
      </Button>
      <RoomModal isOpen={isOpen} onClose={()=>{setIsOpen(false)}}/>
    </div>
  );
}
