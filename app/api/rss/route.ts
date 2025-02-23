import { NextResponse } from "next/server";
import { fetchRSSFeeds } from "@/lib/rss";

export async function GET() {
  try {
    const articles = await fetchRSSFeeds();
    return NextResponse.json({ articles });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch RSS feeds" }, { status: 500 });
  }
}