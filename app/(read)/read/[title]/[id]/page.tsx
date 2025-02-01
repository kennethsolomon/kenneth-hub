"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMangaDetails } from '@/hooks/useMangaDex';
import { getCover } from '@/services/mangaDexService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const MangaDetails = () => {

	const queryClient = useQueryClient();
  const { title, id } = useParams();
	console.log('title:', title, 'id:', id);

	const { data: selectedManga } = useQuery({ queryKey: ["selectedManga"] });

	const {
    data: mangaDetails,
    isLoading: isMangaDetailsLoading,
    isError: isMangaDetailsError,
  } = useMangaDetails(String(id));
	const attributes = mangaDetails?.data?.attributes;

	const coverUrl = getCover(selectedManga);

	console.log(selectedManga, 'selectedManga')
	console.log(coverUrl, 'cover 123')

	return (
		<>
                <Card className="bg-gray-800 flex flex-col items-center">
                  <CardHeader>
                    <CardTitle> {attributes?.title.en} </CardTitle>
                    <CardDescription> { attributes?.description.en } </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {coverUrl && <img src={coverUrl} alt="cover" />}
                  </CardContent>
                </Card>
		</>
	)
}

export default MangaDetails