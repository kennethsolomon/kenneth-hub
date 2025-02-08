"use client";

import { useParams, useRouter } from "next/navigation";
import { useAddReadChapter, useMangaChapter } from "@/hooks/useMangaDex";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowBigRight, Undo2 } from "lucide-react";
import Link from "next/link";

import { Chapter } from "@/types/manga";
import MangaChapter from "@/components/MangaChapter";
import { useAuth } from "@/hooks/useAuth";

function MangaDetails() {
  const { user } = useAuth();
  const router = useRouter();
  const { manga, id, chapter, page } = useParams();
  const [search, setSearch] = useState("");
  const userId = user?.id ?? null; // Ensures it's not undefined
  const getChapter = JSON.parse(String(localStorage.getItem("mangaChapters")));

  const addReadChapter = useAddReadChapter();
  const handleReadChapter = (chapterId: string) => {
    addReadChapter.mutate({
      user_id: userId,
      manga_id: String(id),
      chapter_id: chapterId,
    });
  };

  const handleNextPage = () => {
    const chapterNumber = Number(page) + 1;
    const filteredChapter = getChapter.filter((c: Chapter) => {
      return Number(c.attributes.chapter) === chapterNumber;
    });

    if (filteredChapter[0]?.id) {
      handleReadChapter(String(filteredChapter[0]?.id));
      return router.push(
        `/read/${manga}/${id}/${filteredChapter[0]?.id}/${chapterNumber}`
      );
    }
    router.push(`/read/${manga}/${id}`);
  };

  const handlePreviousPage = () => {
    const chapterNumber = Number(page) - 1;
    const filteredChapter = getChapter.filter((c: Chapter) => {
      return Number(c.attributes.chapter) === chapterNumber;
    });

    if (filteredChapter[0]?.id) {
      handleReadChapter(String(filteredChapter[0]?.id));
      return router.push(
        `/read/${manga}/${id}/${filteredChapter[0]?.id}/${chapterNumber}`
      );
    }
    router.push(`/read/${manga}/${id}`);
  };

  const handleSearch = () => {
    const filteredChapter = getChapter.filter((c: Chapter) => {
      return Number(c.attributes.chapter) === Number(search);
    });

    if (filteredChapter[0]?.id) {
      handleReadChapter(String(filteredChapter[0]?.id));
      return router.push(
        `/read/${manga}/${id}/${filteredChapter[0]?.id}/${Number(search)}`
      );
    }

    router.push(`/read/${manga}/${id}`);
  };

  const { data: mangaChapter, isLoading: isMangaChapterLoading } =
    useMangaChapter(
      String(chapter),
      JSON.parse(String(localStorage.getItem("mangaChapters")))
    );

  return (
    <div className="max-w-[410px] justify-self-center">
      {isMangaChapterLoading && <p>Loading...</p>}
      <Link
        href={
          "/read/" +
          encodeURIComponent(String(manga)).replace(/%20/g, " ") +
          "/" +
          id
        }
      >
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
      <h1 className="text-xl font-bold bg-slate-700 p-2 rounded-md my-2">
        Chapter {page}
      </h1>
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
          <MangaChapter
            className="justify-self-center"
            key={index}
            src={element}
          />
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
    </div>
  );
}

export default MangaDetails;
