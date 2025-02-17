import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function shortenUrl(originalUrl: string, userId: string): Promise<{ shortUrl: string }> {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const shortCode = uuidv4().slice(0, 6);
    const shortUrl = `${BASE_URL}/${shortCode}`;

    const response = await axios.post<{ shortUrl: string }>("/api/shorturl", {
      shortUrl,
      originalUrl,
      userId,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to shorten URL");
  }
}

export async function fetchUserShortUrls(userId: string) {
  try {
    const response = await axios.get<{ shortUrl: string }>(`/api/shorturl?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while fetching URLs");
  }
}

export async function deleteShortUrl(shortUrlId:string) {
  try {
    const response = await axios.delete<{ shortUrl: string }>("/api/shorturl", {
      data: { shortUrlId },
    });

    return response.data;
  } catch (error) {
    console.error("Delete failed:", error);
    throw new Error("Failed to delete shortened URL");
  }
}