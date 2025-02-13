from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import JSONResponse, FileResponse
import yt_dlp
import os
import requests
import re
import time
from pathlib import Path
import urllib.parse
import unicodedata

app = FastAPI()

# Directory to store downloaded videos
DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def sanitize_filename(filename: str, ext: str) -> str:
    """Sanitize filenames by removing special characters and normalizing them."""
    filename = filename.strip()
    filename = unicodedata.normalize("NFKD", filename)  # Normalize Unicode characters
    filename = re.sub(r'[<>:"/\\|?*#☺️]', "", filename)  # Remove invalid characters
    filename = re.sub(r"\s+", "_", filename)  # Replace spaces with underscores
    filename = filename.lower()[:100]  # Limit filename length
    return f"{filename}.{ext}"  # Ensure correct extension

def expand_tiktok_url(short_url: str):
    """Expands shortened TikTok URLs (e.g., vt.tiktok.com) to their full video URL."""
    try:
        response = requests.get(short_url, allow_redirects=True)
        return response.url
    except requests.exceptions.RequestException:
        return short_url

@app.get("/download")
async def download_video(url: str = Query(..., title="Video URL"), mode: str = "redirect"):
    try:
        if "vt.tiktok.com" in url:
            url = expand_tiktok_url(url)

        # ✅ Extract info first to get the title, extension, and thumbnail
        with yt_dlp.YoutubeDL({"format": "best", "nocheckcertificate": True, "cookiesfrombrowser": ("chrome",)}) as ydl:
            info = ydl.extract_info(url, download=False)
            title = info.get("title")
            ext = info.get("ext", "mp4")  # ✅ Ensure a valid extension is retrieved
            thumbnail = info.get("thumbnail")

            sanitized_filename = sanitize_filename(title, ext)
            file_path = Path(DOWNLOAD_DIR) / sanitized_filename

        # ✅ Update yt-dlp options to **force the sanitized filename**
        ydl_opts = {
            "format": "best",
            "nocheckcertificate": True,
            "cookiesfrombrowser": ("chrome",),
            "outtmpl": str(file_path),  # ✅ Ensure yt-dlp uses our filename
        }

        if mode == "download":
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])

            return JSONResponse({
                "video_url": f"/files/{urllib.parse.quote(sanitized_filename)}",
                "title": title,
                "thumbnail": thumbnail
            })

        return JSONResponse({
            "video_url": info.get("url"),
            "title": title,
            "thumbnail": thumbnail
        })

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/files/{filename}")
async def get_file(filename: str):
    """Serves a file from the downloads directory and deletes it after serving."""
    file_path = Path(DOWNLOAD_DIR) / urllib.parse.unquote(filename)

    if not file_path.exists():
        return JSONResponse({"error": f"File not found: {file_path}"}, status_code=404)

    response = FileResponse(file_path, filename=file_path.name)

    # ✅ Auto-delete after serving
    def delete_file():
        time.sleep(5)
        try:
            file_path.unlink()
            print(f"Deleted file: {file_path}")
        except Exception as e:
            print(f"Error deleting file: {e}")

    import threading
    threading.Thread(target=delete_file, daemon=True).start()

    return response
