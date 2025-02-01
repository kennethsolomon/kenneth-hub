import axios from "axios";

export async function POST(req: Request) {
	console.log("Requesting token from MangaDex...");
	const MANGADEX_TOKEN_URI = "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token";
	const MANGADEX_USERNAME = process.env.MANGADEX_USERNAME ?? "";
	const MANGADEX_PASSWORD = process.env.MANGADEX_PASSWORD ?? "";
	const MANGADEX_GRANT_TYPE = process.env.MANGADEX_GRANT_TYPE ?? "";
	const MANGADEX_CLIENT_ID = process.env.MANGADEX_CLIENT_ID ?? "";
	const MANGADEX_CLIENT_SECRET = process.env.MANGADEX_CLIENT_SECRET ?? "";

	try {
		const formData = new URLSearchParams();
		formData.append("username", MANGADEX_USERNAME);
		formData.append("password", MANGADEX_PASSWORD);
		formData.append("grant_type", MANGADEX_GRANT_TYPE);
		formData.append("client_id", MANGADEX_CLIENT_ID);
		formData.append("client_secret", MANGADEX_CLIENT_SECRET);

		const response = await axios.post(MANGADEX_TOKEN_URI, formData, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return new Response(JSON.stringify(response.data), { status: 200 });
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.response?.data || "Internal Server Error" }), { status: 500 });
	}
}