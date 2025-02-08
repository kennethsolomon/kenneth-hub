"use client";
import MangaCover from "@/components/MangaCover";
import { useAuth } from "@/hooks/useAuth";
import { useMangaBookmarks } from "@/hooks/useMangaDex";
import Link from "next/link";
import React from "react";

const Bookmark = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const { data: bookmarks, isLoading: bookmarksLoading } = useMangaBookmarks(
    userId ?? ""
  );

  if (bookmarksLoading) {
    return <p>Loading bookmarks...</p>;
  }

  if (!bookmarks || bookmarks.length === 0) {
    return <p>No bookmarks found.</p>;
  }

  return (
    <>
      {bookmarks?.map((manga) => (
        // /read/One%20Piece/a1c7c817-4e59-43b7-9365-09675a149a6f
        <Link
          href={
            "/read/" +
            encodeURIComponent(manga.title).replace(/%20/g, " ") +
            "/" +
            manga?.manga_id
          }
          key={manga.manga_id}
        >
          <div className="bg-gray-800 rounded-md p-5 mt-3">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-3 ">
                <MangaCover src={manga.cover_url} />
              </div>
              <div className="col-span-9">
                <p className="font-bold text-2xl">{manga.title}</p>
                <p className="line-clamp-6">{manga.description}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Bookmark;
