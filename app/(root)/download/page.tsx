"use client";
import DownloadForm from "@/components/DownloadForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6">Video Downloader</h1>
        <DownloadForm />
      </div>
    </QueryClientProvider>
  );
}
