"use client";
import { format } from "date-fns";
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
  useMangaDetails,
  useAddReadChapter,
  useMangaReadChapter,
} from "@/hooks/useMangaDex";
import { getCover } from "@/services/mangaDexService";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { MouseEventHandler, useEffect, useState } from "react";

import { Chapter } from "@/types/manga";
import MangaCover from "@/components/MangaCover";
import { useAuth } from "@/hooks/useAuth";
import { BookmarkCheck, BookmarkIcon, Loader } from "lucide-react";
import { QueryObserverResult, useQueryClient } from "@tanstack/react-query";

const MangaDetails = () => {
  const { user } = useAuth();
  const params = useParams(); // Get current route params
  const [currentParams, setCurrentParams] = useState(params);
  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [chapters, setChapters] = useState<any[] | undefined>();
  const [search, setSearch] = useState("");

  const userId = user?.id ?? null; // Ensures it's not undefined
  const mangaId = currentParams.id ? String(currentParams.id) : null; // Ensures it's not undefined

  // Hooks
  const { data: bookmark, isLoading: bookmarkLoading } = useMangaBookmark(
    userId && mangaId ? userId : "",
    mangaId ?? ""
  );

  const {
    data: mangaChapters,
    isLoading: isMangaChaptersLoading,
    isError: isMangaChaptersError,
    refetch,
  } = useMangaAllChapters(String(currentParams.id)) as {
    data: Chapter[] | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => Promise<QueryObserverResult<Chapter[] | undefined, Error>>;
  };

  const {
    data: mangaDetails,
    isLoading: isMangaDetailsLoading,
    isError: isMangaDetailsError,
  } = useMangaDetails(String(currentParams.id));

  const {
    data: mangaReadChapter,
    isLoading: isMangaReadChapterLoading,
    isError: isMangaReadChapterError,
  } = useMangaReadChapter({
    user_id: userId,
    manga_id: String(mangaId),
  });

  // useEffects
  useEffect(() => {
    setCurrentParams(currentParams);
  }, [currentParams]); // Update whenever params change

  useEffect(() => {
    if (currentParams.id) {
      console.log("Fetching new manga chapters...");
      refetch(); // Force re-fetch when ID changes
    }
  }, [currentParams.id]);

  useEffect(() => {
    if (!isMangaDetailsLoading && mangaDetails?.data) {
      setCoverUrl(getCover(mangaDetails.data));
    }
  }, [isMangaDetailsLoading, mangaDetails]);

  const attributes = mangaDetails?.data?.attributes;

  useEffect(() => {
    if (mangaChapters) {
      setChapters(mangaChapters);
      localStorage.setItem("mangaChapters", JSON.stringify(mangaChapters));
    }
  }, [mangaChapters]);

  // Methods
  const addBookmark = useAddBookmark();

  const deleteBookmark = useDeleteBookmark();

  const handleAddBookmark = () => {
    if (!user || !currentParams.id || !attributes) return; // Prevent undefined errors

    addBookmark.mutate({
      user_id: user.id,
      manga_id: String(currentParams.id),
      cover_url: String(coverUrl),
      title: attributes.title.en,
      description: attributes.description.en,
    });
  };

  const handleDeleteBookmark = () => {
    if (!user || !currentParams.id || !attributes) return;

    deleteBookmark.mutate({
      user_id: user.id,
      manga_id: String(currentParams.id),
      cover_url: String(coverUrl),
      title: attributes.title.en,
      description: attributes.description.en,
    });
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!mangaChapters) return;

    const filteredChapters = mangaChapters?.filter(
      (chapter) => chapter?.attributes.chapter === search
      // chapter?.attributes.chapter.includes(search)
    );

    setChapters(filteredChapters.length ? filteredChapters : []);
  };

  const addReadChapter = useAddReadChapter();
  const handleReadChapter = (
    e: React.MouseEvent<HTMLAnchorElement>,
    chapterId: string
  ) => {
    addReadChapter.mutate({
      user_id: user.id,
      manga_id: String(currentParams.id),
      chapter_id: chapterId,
    });
  };

  if (
    !!!chapters?.length ||
    bookmarkLoading ||
    isMangaChaptersLoading ||
    isMangaDetailsLoading ||
    isMangaReadChapterLoading ||
    addReadChapter.isPending
  ) {
    return <p>Loading ...</p>;
  }

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
                {attributes?.description.en}
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
                    encodeURIComponent(String(currentParams.manga)).replace(
                      /%20/g,
                      " "
                    ) +
                    "/" +
                    currentParams.id + // Manga ID
                    "/" +
                    chapter.id +
                    "/" +
                    chapter.attributes.chapter
                  }
                  key={chapter.id}
                  onClick={(e) => handleReadChapter(e, chapter.id)}
                >
                  <div
                    className={`flex justify-between mb-2 p-2 rounded-lg ${
                      chapter.id == mangaReadChapter?.chapter_id
                        ? "bg-slate-900"
                        : "bg-slate-700"
                    }`}
                  >
                    <p className="text-white line-clamp-1 text-sm">
                      [{chapter.attributes.chapter}] {chapter.attributes.title}
                    </p>
                    <p className="font-mono text-xs text-slate-400 self-center">
                      {format(
                        new Date(chapter.attributes.readableAt),
                        "MMM dd, yyyy"
                      )}
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
