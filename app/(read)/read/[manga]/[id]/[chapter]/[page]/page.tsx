"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useMangaChapter,
} from "@/hooks/useMangaDex";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowBigRight, Undo2 } from "lucide-react";
import Link from "next/link";

import { Chapter } from "@/types/manga"
import MangaChapter from "@/components/MangaChapter";

function MangaDetails() {
  const router = useRouter();
  const { manga, id, chapter, page } = useParams();
  const [search, setSearch] = useState("");
  const getChapter = JSON.parse(String(localStorage.getItem('mangaChapters')));

  const handleNextPage = () => {
    const filteredChapter = getChapter.filter((c: Chapter) => {
      return Number(c.attributes.chapter) === (Number(page) + 1)
    })

    router.push(`/read/${manga}/${id}/${filteredChapter[0]?.id}/${Number(page)+1}`);
  };

  const handlePreviousPage = () => {
    const filteredChapter = getChapter.filter((c: Chapter) => {
      return Number(c.attributes.chapter) === (Number(page) - 1)
    })

    router.push(`/read/${manga}/${id}/${filteredChapter[0]?.id}/${Number(page)-1}`);
  };

  const handleSearch = () => {
    const filteredChapter = getChapter.filter((c: Chapter) => {
      return Number(c.attributes.chapter) === (Number(search))
    })

    router.push(`/read/${manga}/${id}/${filteredChapter[0]?.id}/${Number(search)}`);
  };

  const {
    data: mangaChapter,
    isLoading: isMangaChapterLoading,
  } = useMangaChapter(String(chapter), JSON.parse(String(localStorage.getItem('mangaChapters'))));

  return (
    <>
      {isMangaChapterLoading && <p>Loading...</p>}
      <Link href={"/read/" + encodeURIComponent(String(manga)).replace(/%20/g, " ") + "/" + id}>
        <Undo2 className="mb-3" />
      </Link>
      <div className="w-full flex mb-2 gap-2">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="anime"
          placeholder="Search Page"
        />
        <Button onClick={handleSearch} type="button">
          Search
        </Button>
      </div>
      {!isMangaChapterLoading && (
        <div className="flex justify-between mb-2">
          <button onClick={handlePreviousPage}>
            <ArrowBigLeft />
          </button>
          <button onClick={handleNextPage}>
            <ArrowBigRight />
          </button>
        </div>
      )}
      {mangaChapter &&
        mangaChapter.map((element, index) => (
          <MangaChapter className="justify-self-center" key={index} src={element} />
        ))}
      {!isMangaChapterLoading && (
        <div className="flex justify-between mb-2">
          <button onClick={handlePreviousPage}>
            <ArrowBigLeft />
          </button>
          <button onClick={handleNextPage}>
            <ArrowBigRight />
          </button>
        </div>
      )}
    </>
  );
}

export default MangaDetails;
