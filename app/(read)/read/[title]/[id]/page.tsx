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
import { formatTitleForUrl, getCover } from "@/services/mangaDexService";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const MangaDetails = () => {
  const { title, id } = useParams();

  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [chapters, setChapters] = useState<any[] | undefined>();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const filteredChapters = mangaChapters?.filter((chapter) =>
      chapter.attributes.chapter.includes(search)
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

  const {
    data: mangaChapters,
    isLoading: isMangaChaptersLoading,
    isError: isMangaChaptersError,
  } = useMangaAllChapters(String(id), 349);

  useEffect(() => {
    if (mangaChapters) {
      setChapters(mangaChapters);
    }
  }, [mangaChapters]);

  console.log(mangaDetails, "mangaDetails");
  // console.log(mangaChapters, "mangaChapters");

  return (
    <>
      <Card className="bg-gray-800 flex flex-col items-center">
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
                    formatTitleForUrl(String(title)) +
                    "/" +
                    id + // Manga ID
                    "/" +
                    chapter.id +
                    "?page=" +
                    (Number(chapter.attributes.chapter) % 10) +
                    "&offset=" +
                    Math.floor(Number(chapter.attributes.chapter) / 10) * 10 +
                    "&limit=10"
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
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default MangaDetails;
