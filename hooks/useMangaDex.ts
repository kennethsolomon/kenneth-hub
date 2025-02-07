"use client";

import { Bookmark, Chapter } from "@/types/manga";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMangaList,
  getMangaDetails,
  getChapters,
  getChapterDetails,
  getAllChapters,
  getChapter,
  addBookmark,
  getBookmarks,
  getBookmark,
  deleteBookmark,
} from "@/services/mangaDexService";
import toast from "react-hot-toast";

export const useMangaList = (title?: string) => {
  return useQuery({
    queryKey: ["mangaList"],
    queryFn: () => getMangaList(title),
  });
};

export const useSaveSelectedManga = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (manga: any) => {
      // Store manga in TanStack Query cache
      queryClient.setQueryData(["selectedManga"], manga);
      return manga;
    },
    onSuccess: (data) => {
      console.log("Manga saved successfully:", data);
    },
  });
};
export const useMangaDetails = (id: string) => {
  return useQuery({
    queryKey: ["mangaDetails", id],
    queryFn: () => getMangaDetails(id),
  });
};

export const useMangaChapters = (
  id: string,
  limit: string,
  offset: string,
  lastChapter?: string
) => {
  console.log("id:", id, "limit:", limit, "offset:", offset);
  return useQuery({
    queryKey: ["mangaChapters", id],
    queryFn: () => getChapters(id, limit, offset, lastChapter),
  });
};

export const useMangaChapter = (
  chapterId: string,
  chapters: Chapter[] | undefined
) => {
  const filteredArray = chapters?.filter((c: Chapter) => {
    return c.id === chapterId;
  });
  return useQuery({
    queryKey: ["mangaChapter", chapterId],
    queryFn: () => getChapter(filteredArray?.[0]?.id ?? ""),
    enabled: !!filteredArray?.[0], // Prevents unnecessary queries
  });
};

export const useMangaChapterDetails = (id: string) => {
  return useQuery({
    queryKey: ["mangaChapterDetails", id],
    queryFn: () => getChapterDetails(id),
  });
};

export const useMangaAllChapters = (id: string) => {
  return useQuery({
    queryKey: ["mangaAllChapters"],
    queryFn: () => getAllChapters(id),
  });
};

// Bookmarks

export const useMangaBookmarks = (userId: string) => {
  return useQuery({
    queryKey: ["mangaDexBookmarks"],
    queryFn: () => getBookmarks(userId),
  });
};

export const useMangaBookmark = (userId: string, magnaId: string) => {
  return useQuery({
    queryKey: ["mangaDexBookmark"],
    queryFn: () => getBookmark(userId, magnaId),
  });
};

export const useAddBookmark = (manga: Bookmark) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => addBookmark(manga),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mangaDexBookmark"] });
      toast.success(`${manga.title} has been added to your bookmarks! 🎉`);
    },
  });
};

export const useDeleteBookmark = (manga: Bookmark) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteBookmark(manga),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mangaDexBookmark"] });
      toast.success(
        `${manga.title} has been deleted removed to your bookmark list! 🪹`
      );
    },
  });
};
