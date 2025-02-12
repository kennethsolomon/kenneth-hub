from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import JSONResponse, FileResponse
import yt_dlp
import os
import requests
import re
import time
from pathlib import Path
import urllib.parse

app = FastAPI()

# Directory to store downloaded videos
DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def sanitize_filename(filename: str) -> str:
    """Sanitize filenames by removing special characters and normalizing them."""
    filename = filename.strip()  # Remove leading/trailing spaces
    filename = re.sub(r'[<>:"/\\|?*#]', "", filename)  # Remove invalid characters
    filename = filename.replace(" ", "_")  # Replace spaces with underscores
    return filename.lower()[:100]  # Limit filename length to 100 characters

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
            ext = info.get("ext", "mp4")  # Default to MP4 if extension is missing

            # ✅ Sanitize filename before saving
            sanitized_filename = sanitize_filename(f"{title}.{ext}")
            file_path = Path(DOWNLOAD_DIR) / sanitized_filename

            if mode == "download":
                return JSONResponse({
                    "video_url": f"/files/{urllib.parse.quote(sanitized_filename)}",
                    "title": title,
                    "thumbnail": thumbnail
                })

        return JSONResponse({
            "video_url": video_url,
            "title": title,
            "thumbnail": thumbnail
        })

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/files/{filename}")
async def get_file(filename: str):
    """Serves a file from the downloads directory and deletes it after serving."""
    file_path = Path(DOWNLOAD_DIR) / urllib.parse.unquote(filename)  # Decode filename

    if not file_path.exists():
        return JSONResponse({"error": f"File not found: {file_path}"}, status_code=404)

    # Serve the file
    response = FileRsponse(file_path, filename=file_path.name)

    # ✅ Auto-delete the file after it's served
    def delete_file():
        time.sleep(5)  # Delay to ensure file is served before deletion
        try:
            file_path.unlink()
            print(f"Deleted file: {file_path}")
        except Exception as e:
            print(f"Error deleting file: {e}")

    # Ensure proper threading
    import threading
    threading.Thread(target=delete_file, daemon=True).start()

    return responsee
