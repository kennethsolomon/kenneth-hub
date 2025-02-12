from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse, FileResponse
import yt_dlp
import os
import requests

app = FastAPI()

# Directory to store downloaded videos
DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def expand_tiktok_url(short_url: str):
    """Expands shortened TikTok URLs (e.g., vt.tiktok.com) to their full video URL."""
    try:
        response = requests.get(short_url, allow_redirects=True)
        return response.url  # Extract final URL after redirection
    except requests.exceptions.RequestException:
        return short_url  # Return original URL if expansion fails

@app.get("/download")
async def download_video(url: str = Query(..., title="Video URL"), mode: str = "redirect"):
    try:
        # ✅ Step 1: Expand Shortened URLs (TikTok short links)
        if "vt.tiktok.com" in url:
            url = expand_tiktok_url(url)

        # ✅ Step 2: Setup yt-dlp options
        ydl_opts = {
            "format": "best",
            "nocheckcertificate": True,
            "cookiesfrombrowser": ("chrome",),
            "outtmpl": f"{DOWNLOAD_DIR}/%(title)s.%(ext)s",
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=(mode == "download"))
            video_url = info.get("url")
            title = info.get("title")
            thumbnail = info.get("thumbnail")

        if not video_url:
            return JSONResponse({"error": "Failed to extract video URL"}, status_code=400)

        # ✅ Instead of redirecting, return the URL in JSON response
        return JSONResponse({
            "video_url": video_url,
            "title": title,
            "thumbnail": thumbnail
        })

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)