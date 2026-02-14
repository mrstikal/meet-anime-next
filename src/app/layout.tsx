import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/assets/css/tailwind.css";
import Navigation from "@/components/Navigation";
import Link from "next/link";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Meet Anime",
  description: "Discover and explore anime with Meet Anime.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={`${roboto.variable} ${roboto.variable} antialiased`}
    >
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xs -mx-8">
        <Navigation/>
      </header>
      {children}
    </div>
    <div className="text-center py-3 px-8 mt-4 text-sm text-zinc-500 border-t border-zinc-800">
      Created by
      <Link href={'mailto:a@mrstik.cz'} className="text-zinc-400 ml-1 underline">
        Alexej Mrštík
      </Link> using React/Nuxt and the Jikan API.
    </div>

    </body>
    </html>
  );
}
