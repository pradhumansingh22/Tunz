"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function JoinButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  return (
    <Button
      className="bg-[#2E3F3C] text-white rounded-full px-6 py-2 mr-3 hover:bg-[#69a197]"
      onClick={() => router.push(isLoggedIn ? "/dashboard" : "/signin")}
    >
      Let's Go
    </Button>
  );
}
