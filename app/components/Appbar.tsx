"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export const Appbar = () => {
    const session = useSession();
    return (
      <div className="w-full">
        {/* Navigation */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4 flex justify-between items-center border-b border-gray-800">
          <div className="text-purple-100 font-bold text-xl">Tunz</div>
          <div className="flex gap-4 items-center">
            <button className="text-purple-100 hover:text-purple-300">
              Features
            </button>
            <button className="text-purple-100 hover:text-purple-300">
              How It Works
            </button>
            {session.data?.user && (
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg font-semibold"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            )}
            {!session.data?.user && (
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg font-semibold"
                onClick={() => signIn()}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    );
}