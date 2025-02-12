import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
    }

    const response = await fetch(
      `http://localhost:8000/download?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}
