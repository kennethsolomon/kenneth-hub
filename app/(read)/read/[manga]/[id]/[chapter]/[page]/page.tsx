"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  useMangaChapter,
  useMangaChapterDetails,
  useMangaChapters,
  useMangaDetails,
} from "@/hooks/useMangaDex";
import { cache, use, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowBigRight, Undo2 } from "lucide-react";
import Link from "next/link";
import { formatTitleForUrl } from "@/services/mangaDexService";

function MangaDetails() {
  const router = useRouter();
  const { manga, id, chapter, page } = useParams();
  const [search, setSearch] = useState("");
  const getChapter = JSON.parse(localStorage.getItem('mangaChapters'));

  const handleNextPage = () => {
    const filteredChapter = getChapter.filter((c) => {
      return Number(c.attributes.chapter) === (Number(page) + 1)
    })

    router.push(`/read/${manga}/${id}/${filteredChapter[0]?.id}/${Number(page)+1}`);
  };

  const handlePreviousPage = () => {
    const filteredChapter = getChapter.filter((c) => {
      return Number(c.attributes.chapter) === (Number(page) - 1)
    })

    router.push(`/read/${manga}/${id}/${filteredChapter[0]?.id}/${Number(page)-1}`);
  };

  const handleSearch = () => {
    const filteredChapter = getChapter.filter((c) => {
      return Number(c.attributes.chapter) === (Number(search))
    })

    router.push(`/read/${manga}/${id}/${filteredChapter[0]?.id}/${Number(search)}`);
  };

  const {
    data: mangaChapter,
    isLoading: isMangaChapterLoading,
  } = useMangaChapter(String(chapter), JSON.parse(localStorage.getItem('mangaChapters')));

  return (
    <>
      <Link href={"/read/" + formatTitleForUrl(String(manga)) + "/" + id}>
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
          <img className="justify-self-center" key={index} src={element} alt="cover" />
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
