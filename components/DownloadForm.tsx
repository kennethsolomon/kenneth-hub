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

  const downloadMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.video_url) {
        setDownloadUrl(data.video_url);
        setTitle(data.title);
        setThumbnail(data.thumbnail);
        setVideoUrl("");
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
      <Button
        className="w-full"
        onClick={() => downloadMutation.mutate(videoUrl)}
        disabled={downloadMutation.isPending}
      >
        {downloadMutation.isPending ? "Fetching..." : "Download Video"}
      </Button>

      {downloadUrl && (
        <div className="mt-4 text-center">
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Video Thumbnail"
              className="w-48 mx-auto"
            />
          )}{" "}
          <h3 className="text-lg font-semibold">{title}</h3>
          <a
            href={downloadUrl}
            className="text-blue-500"
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to Download
          </a>
        </div>
      )}
    </div>
  );
}
