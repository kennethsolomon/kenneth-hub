"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  useMangaChapter,
  useMangaChapterDetails,
  useMangaChapters,
  useMangaDetails,
} from "@/hooks/useMangaDex";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowBigRight, Undo2 } from "lucide-react";
import Link from "next/link";
import { formatTitleForUrl } from "@/services/mangaDexService";

function MangaDetails() {
  const queryClient = useQueryClient();
  const { title, id, chapter } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Get the current page from URL or default to 1
  const currentPage = Number(searchParams.get("page")) || 1;
  const offset = Number(searchParams.get("offset")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;

  console.log("Current Chapter ID", chapter);

  useEffect(() => {
    if (!searchParams.has("page")) {
      setPageUrl(1, offset, limit);
    }
  }, [searchParams, offset, limit]); // Ensure it reacts to changes

  // Function to update page param
  const setPageUrl = (page: Number | String, offset: Number, limit: Number) => {
    router?.push(`?page=${page}&offset=${offset}&limit=${limit}`);
  };

  const handleNextPage = () => {
    const newPage = currentPage >= 10 ? 1 : currentPage + 1;
    const newOffset = currentPage >= 10 ? offset + 10 : offset;

    queryClient.invalidateQueries({ queryKey: ["mangaChapterDetails"] }); // Force re-fetch
    queryClient.invalidateQueries({ queryKey: ["mangaChapters"] }); // Force re-fetch

    setPageUrl(newPage, newOffset, limit);
  };
  const handlePreviousPage = () => {
    const newPage = currentPage <= 0 ? 1 : currentPage - 1;
    const newOffset = currentPage <= 0 ? offset - 10 : offset;

    queryClient.invalidateQueries({ queryKey: ["mangaChapterDetails"] }); // Force re-fetch
    queryClient.invalidateQueries({ queryKey: ["mangaChapters"] }); // Force re-fetch

    setPageUrl(newPage, newOffset, limit);
  };

  const {
    data: mangaDetails,
    isLoading: isMangaDetailsLoading,
    isError: isMangaDetailsError,
  } = useMangaDetails(String(id));
  const {
    data: mangaChapters,
    isLoading: isMangaChaptersLoading,
    isError: isMangaChaptersError,
  } = useMangaChapters(String(id), String(limit), String(offset));
  const mangaChapterId = mangaChapters?.data[currentPage - 1]?.id;
  const { data: mangaChapterDetails } = useMangaChapterDetails(mangaChapterId);

  console.log("Manga Details:", mangaDetails);
  console.log("Manga Chapters:", mangaChapters);
  // console.log('Manga Chapter Details:', mangaChapterDetails);
  const handleSearch = () => {
    const newPage = Number(search) % 10;
    const newOffset = Math.floor(Number(search) / 10) * 10;

    queryClient.invalidateQueries({ queryKey: ["mangaChapterDetails"] }); // Force re-fetch
    queryClient.invalidateQueries({ queryKey: ["mangaChapters"] }); // Force re-fetch

    setPageUrl(newPage, newOffset, limit);
  };

  const {
    data: mangaChapter,
    isLoading: isMangaChapterLoading,
    isError: isMangaChapterError,
  } = useMangaChapter(String(id), String(chapter));

  console.log(mangaChapter, "mangaChapter");
  return (
    <>
      <Link href={"/read/" + formatTitleForUrl(String(title)) + "/" + id}>
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
          <img key={index} src={element} alt="cover" />
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
