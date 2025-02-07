// src/types/manga.ts
export type Chapter = {
  id: string;
  attributes: {
    volume: string;
    chapter: string;
    title?: string | null;
    translatedLanguage: string;
    externalUrl?: string | null;
    publishAt: string;
    readableAt: string;
    createdAt: string;
    updatedAt: string;
    pages: number;
    version: number;
  };
  relationships: {
    id: string;
    type: string;
  }[];
};

export type Bookmark = {
  user_id: string;
  manga_id: string;
  cover_url: string;
  title: string;
  description: string;
}