"use client";
import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = "https://kls.cx/"; // Change this to your domain

export default function URLShortener(): JSX.Element {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [urlMap, setUrlMap] = useState<Record<string, string>>({});

  const handleShorten = () => {
    if (!originalUrl) {
      toast.error("Please enter a valid URL");
      return;
    }

    const shortCode = uuidv4().slice(0, 6); // Generate a short unique ID
    const shortUrl = `${BASE_URL}${shortCode}`;

    setUrlMap((prev) => ({ ...prev, [shortCode]: originalUrl }));
    setShortenedUrl(shortUrl);
    toast.success("URL Shortened Successfully!");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-800 text-white rounded-xl w-96 shadow-lg">
      <h2 className="text-xl font-bold mb-4">URL Shortener</h2>
      <Input
        type="url"
        placeholder="Enter URL to shorten"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        className="mb-4 w-full"
      />
      <Button onClick={handleShorten} className="mb-4 w-full">
        Shorten URL
      </Button>
      {shortenedUrl && (
        <div className="mt-4">
          <p className="text-sm">Shortened URL:</p>
          <a
            href={shortenedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            {shortenedUrl}
          </a>
        </div>
      )}
    </div>
  );
}
