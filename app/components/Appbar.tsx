"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Appbar = () => {
  const session = useSession();
  const router = useRouter()
  const user = session.data?.user;

  const handleClick = async() => {
    user ? await signOut() : router.push("/api/auth/signin");
  }
    return (
      <div className="w-full bg-transparent">
        <div className="flex justify-between pt-4">
          <div className="flex items-center ml-10">
            <div className="h-8 w-8 rounded-full bg-[#2E3F3C] font-semibold text-white flex justify-center items-center ml-5 mx-2">
              T
            </div>
            <div className="text-[#2E3F3C] font-bold">TunZ</div>
          </div>
          <div className="mr-5">
            <button className="rounded-2xl text-[#364e49] text-xs font-semibold bg-white border-gray-800 px-6 py-2 mr-10 border hover:text-[#2b9a82] hover:border-[#2b9a82]" onClick={handleClick}>
              {user ? "Log Out" : "Log In"}
            </button>
          </div>
        </div>
      </div>
    );
}