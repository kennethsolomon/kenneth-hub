"use client";

import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useDeleteShortUrl, useShortenUrl, useUserShortUrls } from "@/hooks/useShortenUrl";
import { Trash } from "lucide-react";

export default function URLShortener(): JSX.Element {
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const mutation = useShortenUrl();
  const { data: shortUrls, isLoading } = useUserShortUrls();
  const deleteMutation = useDeleteShortUrl();

  const handleShorten = (): void => {
    if (!originalUrl) {
      toast.error("Please enter a valid URL");
      return;
    }
    mutation.mutate(originalUrl);
    setOriginalUrl("");
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
      <Button onClick={handleShorten} className="mb-4 w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Shortening..." : "Shorten URL"}
      </Button>
      {mutation.data && (
        <div className="mt-4">
          <p className="text-sm">Shortened URL:</p>
          <a
            href={mutation.data.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            {mutation.data.shortUrl}
          </a>
        </div>
      )}
      <div className="mt-6 w-full">
        <h3 className="text-lg font-semibold mb-2">Your Saved URLs</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          Array.isArray(shortUrls) ? (
            <ul className="text-sm">
              {shortUrls.map((url, index) => (
                <li key={index} className="mb-2 flex justify-between items-center">
                  <div>
                    <a href={url.shorten_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                      {url.shorten_url}
                    </a>
                    <p className="text-gray-400">ID: {url.id}</p>
                    <p className="text-gray-400">Original:{url.original_url}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="ml-2"
                    onClick={() => deleteMutation.mutate(url.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No URLs found.</p>
          )
        )}
      </div>
    </div>
  );
}