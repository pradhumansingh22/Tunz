import React from "react";

type LoadingButtonProps = {
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export const LoadingButton = ({
  loading = false,
  onClick,
  children,
}: LoadingButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center bg-[#2E3F3C] hover:bg-[#2E3F3C]/90 text-[#e3e7d7] px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px] h-9 sm:h-10"
    >
      {loading ? (
        <svg
          className="w-4 h-4 animate-spin text-[#e3e7d7]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  );
};
