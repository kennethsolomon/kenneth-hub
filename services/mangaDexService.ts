import createApiClient from '@/lib/axiosInstance';

const api = createApiClient('mangaDex', 'https://api.mangadex.org');

export const getMangaList = async (title?: String) => {
  const response = await api.get(`/manga?limit=20&includes[]=cover_art&title=${title}`);
	console.log("Manga List: ", response.data);
  return response.data;
};

export const getCover = (manga: any) => {
	const coverArt = manga?.relationships.find((rel: any) => rel.type === 'cover_art');
	const imageUrl = "https://uploads.mangadex.org/covers/" + manga?.id + "/" + coverArt?.attributes?.fileName + ".512.jpg";
	return imageUrl;
};

export const getMangaDetails = async (id: string) => {
	const url = `/manga/${id}`;
	const response = await api.get(url);
	return response.data;
};

export const getChapters = async (id: string, limit: string, offset: string) => {
	const url = `/chapter?manga=${id}&limit=${limit}&offset=${offset}&translatedLanguage[]=en`;

	const response = await api.get(url);
	return response.data;
};

export const getChapterDetails = async (id: string) => {
	const url = `/at-home/server/${id}`
	const response = await api.get(url);
	const chapters: string[] = []; // Explicitly define the type
	const baseURL = response.data.baseUrl;
	const hash = response.data.chapter.hash;

	response.data.chapter.data.forEach((chapter: string) => {
		chapters.push(`${baseURL}/data/${hash}/${chapter}?langCode=en`);
	});

	console.log("Chapter Details: ", response.data);
	return chapters;
};