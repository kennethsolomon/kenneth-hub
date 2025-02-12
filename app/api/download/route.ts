import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const mode = searchParams.get("mode") || "redirect"; // Default to redirect mode

    if (!url) {
      return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
    }

    // ✅ Fetch video metadata from FastAPI (title, thumbnail, video_url)
    const response = await fetch(
      `http://localhost:8000/download?url=${encodeURIComponent(
        url
      )}&mode=${mode}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );

    const data = await response.json();

    if (!data.video_url) {
      throw new Error("Failed to fetch video URL");
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}
