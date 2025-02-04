"use client"; // Ensure this is a Client Component

import QueryProvider from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Book } from "lucide-react";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <main className="container mx-auto p-4 max-w-[430px] sm:max-w-[1024px]">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">
            Kenneth's Hub | Manga Reader
          </h1>
          <Link href="/read">
            <Book />
          </Link>
        </header>

        <QueryProvider>{children}</QueryProvider>
      </main>
    </ThemeProvider>
  );
}
