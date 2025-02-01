"use client";
import React, { useState } from "react";
import { useMangaList, useSaveSelectedManga, useSelectedManga } from "@/hooks/useMangaDex";
import { getCover } from "@/services/mangaDexService";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const MangaList = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
	const { mutate: saveSelectedManga } = useSaveSelectedManga();

  const { data, isLoading, isError } = useMangaList(search);
  const mangaList = data?.data;

  const formatTitleForUrl = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-"); // Convert spaces to hyphens

  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: ["mangaList"] }); // Force re-fetch

    console.log("Search:", search);
  };

  const handleSelectedManga = (manga: object) => {
    saveSelectedManga(manga);
  };


  return (
    <>
      <h1>Read Page</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}
      <div className="w-full flex mb-2 gap-2">
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
			<div className="grid grid-cols-1 gap-4">
      {mangaList &&
        mangaList.map((manga: any) => {
          const coverUrl = getCover(manga);
          const title = manga.attributes?.title?.en || "Unknown Title";
          const description = manga.attributes?.description?.en || "Unknown Title";
          return (
            <div key={manga.id}>
							<button onClick={() => handleSelectedManga(manga)}>Select</button>
              <Link
                href={"/read/" + formatTitleForUrl(title) + "/" + manga?.id}
								onClick={() => handleSelectedManga(manga)}
              >
                <Card className="bg-gray-800 flex flex-col items-center">
                  <CardHeader>
                    <CardTitle> {title} </CardTitle>
                    <CardDescription> {description} </CardDescription>
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
