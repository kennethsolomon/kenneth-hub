"use client"; // Ensure this is a Client Component
import { Book, Star } from "lucide-react";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="container mx-auto p-4 max-w-[430px] sm:max-w-[768px]">
      <header className="flex justify-between items-center mb-4">
        <Link href={"/"}>
          <h1 className="text-3xl font-semibold">
            Kenneth's Hub | Manga Reader
          </h1>
        </Link>
        <div className="flex gap-3">
          <Link href="/read/bookmark">
            <Star />
          </Link>
          <Link href="/read">
            <Book />
          </Link>
        </div>
      </header>
      {children}
    </main>
  );
}
