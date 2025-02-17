import { createClient } from "@/lib/supabase/supabaseServer";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shortUrl, originalUrl, userId } = body;

    if (!originalUrl || typeof originalUrl !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("short_urls").insert(
      [
        {
          'shorten_url': shortUrl,
          'original_url': originalUrl,
          'user_id': userId
        }
      ]
    );

    if (error) throw new Error("Server Error.");

    return NextResponse.json({ shortUrl });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { "Allow": "POST, OPTIONS" } });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("short_urls")
      .select("id, shorten_url, original_url")
      .eq("user_id", userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error("Database Error");

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { shortUrlId } = await req.json(); // Extract from request body

    if (!shortUrlId) {
      return NextResponse.json({ error: "Short URL ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("short_urls")
      .delete()
      .eq("id", shortUrlId);

    if (error) {
      console.error("Database Error:", error);
      return NextResponse.json({ error: "Failed to delete URL" }, { status: 500 });
    }

    return NextResponse.json({ message: "Short URL deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}