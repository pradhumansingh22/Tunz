import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";



export const metadata: Metadata = {
  title: "GrooveHouse",
  description:
    "A collaborative music room platform where users can join rooms and queue songs to enjoy together in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
