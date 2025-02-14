import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log('Route in short URL');

    // Create a new URL object from the request URL
    const url = new URL(req.url);

    // Extract pathname
		const pathname = url.pathname;
    console.log(pathname, ' from routes.ts'); // Logs the route path (e.g., "/api/example")

    // Check supabase url column

		return NextResponse.redirect("https://example.com");
    // return NextResponse.json({ pathname: url.pathname });
}