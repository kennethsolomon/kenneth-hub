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
  useMangaAllChapters,
  useMangaChapters,
  useMangaDetails,
} from "@/hooks/useMangaDex";
import { getCover } from "@/services/mangaDexService";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";

import { Chapter } from "@/types/manga";

const MangaDetails = () => {
  const { manga, id } = useParams();

  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [chapters, setChapters] = useState<any[] | undefined>();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    setTimeout(() => {
      const storedManga = localStorage.getItem("selectedManga");
      const selectedManga = storedManga ? JSON.parse(storedManga) : null;

      if (selectedManga) {
        setCoverUrl(getCover(selectedManga));
      }
    }, 1000);
    setIsLoading(false);
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
    setIsLoading(false);
  }, [mangaChapters]);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <Card className="bg-gray-800 flex flex-col justify-self-center items-center sm:max-w-[768px]">
          <CardHeader>
            <CardTitle> {attributes?.title.en} </CardTitle>
            <CardDescription> {attributes?.description.en} </CardDescription>
          </CardHeader>
          <CardContent>
            {coverUrl && <img src={coverUrl} alt="cover" />}
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
                        {chapter.attributes.chapter} -{" "}
                        {chapter.attributes.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MangaDetails;
