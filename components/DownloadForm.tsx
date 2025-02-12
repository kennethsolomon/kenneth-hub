"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DownloadForm() {
  const [videoUrl, setVideoUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [mode, setMode] = useState("redirect"); // Default mode

  const downloadMutation = useMutation({
    mutationFn: async ({ url, mode }: { url: string; mode: string }) => {
      const res = await fetch(
        `/api/download?url=${encodeURIComponent(url)}&mode=${mode}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (data.video_url) {
        setDownloadUrl(data.video_url);
        setTitle(data.title);
        setThumbnail(data.thumbnail);
      }
    },
  });

  return (
    <div className="flex flex-col items-center space-y-4 p-4 max-w-md mx-auto w-full">
      <Input
        className="w-full"
        type="text"
        placeholder="Enter Video URL (TikTok, FB, YT, IG)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <div className="flex space-x-4">
        <Button
          className="w-full"
          onClick={() => {
            setMode("redirect");
            downloadMutation.mutate({ url: videoUrl, mode: "redirect" });
          }}
          disabled={downloadMutation.isPending}
        >
          {downloadMutation.isPending ? "Fetching..." : "Preview Video"}
        </Button>

        <Button
          className="w-full"
          onClick={() => {
            setMode("download");
            downloadMutation.mutate({ url: videoUrl, mode: "download" });
          }}
          disabled={downloadMutation.isPending}
        >
          {downloadMutation.isPending ? "Fetching..." : "Download Video"}
        </Button>
      </div>

      {downloadUrl && (
        <div className="mt-4 text-center">
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Video Thumbnail"
              className="w-48 mx-auto"
            />
          )}
          <h3 className="text-lg font-semibold">{title}</h3>

          {mode === "redirect" ? (
            <a
              href={downloadUrl}
              className="text-blue-500 font-bold mt-2 block"
              target="_blank"
              rel="noopener noreferrer"
            >
              📺 Watch Video
            </a>
          ) : (
            <a
              href={downloadUrl}
              className="text-blue-500 font-bold mt-2 block"
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 Download Now
            </a>
          )}
        </div>
      )}
    </div>
  );
}
