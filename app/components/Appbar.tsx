"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Appbar = () => {
  const { data: session, status } = useSession();
    const router = useRouter();

  if(status === "loading") return <div>loading...</div>
  console.log("session loaded", session)

  const user = session?.user;

  console.log(user)
  console.log(status)
  console.log("Image", user?.image);

  const handleClick = async() => {
    user ? await signOut() : router.push("/api/auth/signin");
  }
    return (
      <div className="w-full bg-transparent">
        <div className="flex justify-between items-center pt-4 px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-[#2E3F3C] font-semibold text-white flex justify-center items-center">
              T
            </div>
            <div className="text-[#2E3F3C] font-bold ml-2 text-lg sm:text-xl">
              TunZ
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="rounded-2xl text-[#364e49] text-xs sm:text-sm font-semibold bg-white border-gray-800 px-3 sm:px-4 md:px-6 py-2 border hover:text-[#2b9a82] hover:border-[#2b9a82] transition-colors"
              onClick={handleClick}
            >
              {user ? "Log Out" : "Log In"}
            </button>
            {user?.image && (
              <img
                src={user.image || "/placeholder.svg"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border object-cover"
              />
            )}
          </div>
        </div>
      </div>
    );
}