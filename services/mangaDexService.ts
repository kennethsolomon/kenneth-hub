import createApiClient from '@/lib/axiosInstance';

// const api = createApiClient('mangaDex', 'https://api.mangadex.org');
const api = createApiClient('mangaDex', '/mangadex/');

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

export const getChapters = async (id: string, limit: string, offset: string, lastChapter?: string) => {
	const url = `/chapter?manga=${id}&limit=${lastChapter ? lastChapter : limit}&offset=${offset}&translatedLanguage[]=en`;

	const response = await api.get(url);
	return response.data;
};

export const getAllChapters = async (id: string) => {
    let allChapters: any[] = [];
    let offset = 0;
    const limit = 100; // Adjust based on API constraints

		let loop = true;
    do {
        const url = `/chapter?manga=${id}&limit=${limit}&offset=${offset}&translatedLanguage[]=en`;
        const response = await api.get(url);

        allChapters = [...allChapters, ...response.data.data];
        offset += limit;

				if(!response.data.data.length) {
					loop = false
				}
    } while (loop);


		const sortedChapters = allChapters.sort((a, b) => {
				return parseFloat(b.attributes.chapter) - parseFloat(a.attributes.chapter);
		});


		const uniqueChapters = Object.values(
			sortedChapters.reduce((acc, chapter) => {
					const key = `${chapter.attributes.volume}-${chapter.attributes.chapter}`;
					if (!acc[key]) {
            acc[key] = chapter; // Keep the first occurrence
					}
					return acc;
			}, {})
	);


	return uniqueChapters;

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

	return chapters;
};

export const getChapter = async (chapterId: string) => {
	const url = `/at-home/server/${chapterId}`
	const response = await api.get(url);
	console.log(response, 'getChapter')
	const baseURL = response.data.baseUrl;
	const hash = response.data.chapter.hash;
	const chapters: string[] = []; // Explicitly define the type

	response.data.chapter.data.forEach((chapter: string) => {
		chapters.push(`${baseURL}/data/${hash}/${chapter}?langCode=en`);
	});

	return chapters;
}


export const formatTitleForUrl = (title: string) =>
	title.toLowerCase().replace(/\s+/g, "-"); // Convert spaces to hyphens