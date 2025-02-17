import { createClient } from "@/lib/supabase/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    console.log('Route in short URL');

    // Create a new URL object from the request URL
    const url = new URL(req.url);

    // Extract pathname
    const pathname = url.pathname;
    console.log(pathname, ' from routes.ts'); // Logs the route path (e.g., "/api/example")

    const shortUrl = `${BASE_URL}${pathname}`;

    console.log(shortUrl)
    // Check supabase url column
    const supabase = await createClient();
    let { data, error } = await supabase
      .from("short_urls")
      .select("*")
      .eq("shorten_url", shortUrl)
      .single()

    if (error) throw new Error("Server Error.");

    const { original_url } = data;

    return NextResponse.redirect(original_url);
  } catch (error) {
    return NextResponse.redirect(BASE_URL);
  }
}