from fastapi import FastAPI
import yt_dlp

app = FastAPI()

@app.get("/download")
async def download_video(url: str):
    try:
        ydl_opts = {"format": "best"}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

            return {
                "video_url": info.get("url"),
                "title": info.get("title"),
                "thumbnail": info.get("thumbnail")  # Fetch thumbnail if available
            }
    except Exception as e:
        return {"error": str(e)}

# Run the server
# uvicorn server:app --host 0.0.0.0 --port 8000
