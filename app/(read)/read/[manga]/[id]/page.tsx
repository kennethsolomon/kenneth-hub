"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useAddBookmark,
  useDeleteBookmark,
  useMangaAllChapters,
  useMangaBookmark,
  useMangaChapters,
  useMangaDetails,
} from "@/hooks/useMangaDex";
import { getCover } from "@/services/mangaDexService";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";

import { Chapter } from "@/types/manga";
import MangaCover from "@/components/MangaCover";
import { useAuth } from "@/hooks/useAuth";
import { BookmarkCheck, BookmarkIcon, Loader } from "lucide-react";

const MangaDetails = () => {
  const { user } = useAuth();
  const { manga, id } = useParams();

  const userId = user?.id ?? null; // Ensures it's not undefined
  const mangaId = id ? String(id) : null; // Ensures it's not undefined

  const {
    data: bookmark,
    isLoading: bookmarkLoading,
    isError,
  } = useMangaBookmark(userId && mangaId ? userId : null, String(mangaId));

  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [chapters, setChapters] = useState<any[] | undefined>();
  const [search, setSearch] = useState("");

  const {
    data: mangaChapters,
    isLoading: isMangaChaptersLoading,
    isError: isMangaChaptersError,
  } = useMangaAllChapters(String(id)) as {
    data: Chapter[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const filteredChapters = mangaChapters?.filter((chapter) =>
      chapter?.attributes.chapter.includes(search)
    );
    setChapters(filteredChapters);
  };

  useEffect(() => {
    const storedManga = localStorage.getItem("selectedManga");
    const selectedManga = storedManga ? JSON.parse(storedManga) : null;

    if (selectedManga) {
      setCoverUrl(getCover(selectedManga));
    }
  }, []);

  const {
    data: mangaDetails,
    isLoading: isMangaDetailsLoading,
    isError: isMangaDetailsError,
  } = useMangaDetails(String(id));

  const attributes = mangaDetails?.data?.attributes;

  useEffect(() => {
    setTimeout(() => {
      if (mangaChapters) {
        setChapters(mangaChapters);
        localStorage.setItem("mangaChapters", JSON.stringify(mangaChapters));
      }
    }, 1000);
  }, [mangaChapters]);

  const addBookmark = useAddBookmark({
    user_id: user?.id,
    manga_id: String(id),
    cover_url: String(coverUrl),
    title: attributes?.title.en,
    description: attributes?.description.en,
  });

  const deleteBookmark = useDeleteBookmark({
    user_id: user?.id,
    manga_id: String(id),
    cover_url: String(coverUrl),
    title: attributes?.title.en,
    description: attributes?.description.en,
  });

  const handleAddBookmark = () => {
    if (!addBookmark) return; // Prevent calling mutate() if addBookmark is null
    addBookmark.mutate();
  };

  const handleDeleteBookmark = () => {
    if (!deleteBookmark) return; // Prevent calling mutate() if addBookmark is null
    deleteBookmark.mutate();
  };

  console.log(bookmark, bookmarkLoading, bookmark?.length);
  return (
    <>
      {!coverUrl && <p>Loading...</p>}
      {coverUrl && (
        <Card className="bg-gray-800 flex flex-col justify-self-center items-center sm:max-w-[768px]">
          <CardHeader>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <CardTitle> {attributes?.title.en} </CardTitle>
                {!bookmarkLoading ? (
                  bookmark?.length ? (
                    <BookmarkCheck
                      className="cursor-pointer"
                      onClick={handleDeleteBookmark}
                    />
                  ) : (
                    <BookmarkIcon
                      className="cursor-pointer"
                      onClick={handleAddBookmark}
                    />
                  )
                ) : (
                  <Loader className="animate-spin" />
                )}
              </div>
              <CardDescription className="mt-5">
                {" "}
                {attributes?.description.en}{" "}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {coverUrl && <MangaCover src={coverUrl} />}
            <div className="text-white font-bold mt-3">
              <p>Latest Chapter: {attributes?.lastChapter}</p>
              <p>Status: {attributes?.status}</p>
              <p>Year: {attributes?.year}</p>
            </div>
            <div className="flex mb-2 gap-2 my-5">
              <Input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                type="anime"
                placeholder="Search Chapter #"
                className="bg-slate-700 placeholder-red-500"
              />
              <Button onClick={handleSearch} type="button">
                Search
              </Button>
            </div>
            <h2 className="justify-self-center text-white text-3xl font-bold my-3">
              Chapters
            </h2>
            <div className="flex flex-col">
              {chapters?.map((chapter) => (
                <Link
                  href={
                    "/read/" +
                    encodeURIComponent(String(manga)).replace(/%20/g, " ") +
                    "/" +
                    id + // Manga ID
                    "/" +
                    chapter.id +
                    "/" +
                    chapter.attributes.chapter
                  }
                  key={chapter.id}
                >
                  <div className="flex flex-col bg-slate-700 mb-2 p-2 rounded-lg">
                    <p className="text-white">
                      {chapter.attributes.chapter} - {chapter.attributes.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MangaDetails;
