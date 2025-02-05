"use client";
import React, { useEffect, useState } from "react";
import { useMangaList } from "@/hooks/useMangaDex";
import { getCover } from "@/services/mangaDexService";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MangaList = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useMangaList(search);
  const mangaList = data?.data;

  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: ["mangaList"] }); // Force re-fetch

    console.log("Search:", search);
  };

  const handleSelectedManga = (manga: object) => {
    localStorage.setItem("selectedManga", JSON.stringify(manga));
  };

  useEffect(() => {
    if (localStorage.getItem("selectedManga")) {
      localStorage.clear();
    }
  });

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}
      <div className="flex mb-2 gap-2 sticky top-2">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="anime"
          placeholder="Search Manga"
        />
        <Button onClick={handleSearch} type="button">
          Search
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {mangaList &&
          mangaList.map((manga: any) => {
            const coverUrl = getCover(manga);
            const title = manga.attributes?.title?.en || "Unknown Title";
            const description =
              manga.attributes?.description?.en || "Unknown Title";
            return (
              <div key={manga.id}>
                <Link
                  href={"/read/" + encodeURIComponent(title).replace(/%20/g, " ") + "/" + manga?.id}
                  onClick={() => handleSelectedManga(manga)}
                >
                  <Card className="bg-gray-800">
                  {/* <Card className="bg-gray-800 flex flex-col items-center mb-3"> */}
                    <CardHeader>
                      <CardTitle> {title} </CardTitle>
                      <CardDescription className="line-clamp-6"> {description} </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {coverUrl && <img src={coverUrl} alt="cover" />}{" "}
                    </CardContent>
                  </Card>
                </Link>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default MangaList;
