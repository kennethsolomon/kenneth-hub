"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMangaList, getMangaDetails, getChapters, getChapterDetails, getAllChapters, getChapter } from '@/services/mangaDexService';

export const useMangaList = (title?: string) => {
  return useQuery({ queryKey: ['mangaList'], queryFn: () => getMangaList(title) });
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
  return useQuery({ queryKey: ['mangaDetails', id], queryFn: () => getMangaDetails(id) });
};

export const useMangaChapters = (id: string, limit: string, offset: string, lastChapter?: string) => {
	console.log('id:', id, 'limit:', limit, 'offset:', offset);
  return useQuery({ queryKey: ['mangaChapters', id], queryFn: () => getChapters(id, limit, offset, lastChapter) });
};

export const useMangaChapter = (mangaId: string, chapterId: string) => {
  return useQuery({ queryKey: ['mangaChapter', chapterId], queryFn: () => getChapter(mangaId, chapterId) });
};

export const useMangaChapterDetails = (id: string) => {
  return useQuery({ queryKey: ['mangaChapterDetails', id], queryFn: () => getChapterDetails(id) });
};

export const useMangaAllChapters = (id: string, totalChapters: number) => {
  return useQuery({ queryKey: ['mangaAllChapters', id], queryFn: () => getAllChapters(id, totalChapters)});
};


