import axios from 'axios';

export const getToken = async (source: string) => {
	switch (source) {
		case 'mangaDex':
			const response = await axios.post("/api/mangadex/token");
			console.log("Token response: ", response.data);
			return response.data.access_token;

			default:
			break;
	}
};