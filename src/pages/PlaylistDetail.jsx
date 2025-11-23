import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { playlists } from "../data/playlists";

export default function PlaylistDetail() {
  const { moodId } = useParams();
  const [searchParams] = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef(null);

  const playlist = playlists.find((p) => p.moodId === moodId);

  if (!playlist) {
    return <p style={{ padding: "20px" }}>Playlist not found!</p>;
  }

  async function handleExportPoster() {
    if (!cardRef.current) return;

    try {
      setIsExporting(true);
      // wait for watermark to show
      await new Promise((resolve) => setTimeout(resolve, 80));

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${playlist.moodId}-mood-poster.png`;
      link.click();
    } catch (err) {
      console.error("Failed to export poster:", err);
      alert("Oops, something went wrong while exporting the poster.");
    } finally {
      setIsExporting(false);
    }
  }

  // if coming from "?mode=export", auto-export once
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "export") {
      handleExportPoster();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container playlist-detail-page">
      {/* back button */}
      <div className="detail-back">
        <a href="/playlists" className="back-btn">
          ← Back to playlists
        </a>
      </div>

      <div
        className="playlist-detail-card"
        data-mood={playlist.moodId}
        ref={cardRef}
      >
        {/* header: icon + title + count */}
        <div className="detail-header">
          <img
            className="detail-icon"
            src={playlist.cover}
            alt={`${playlist.title} mood icon`}
          />
          <div>
            <h2 className="detail-title">{playlist.title}</h2>
            <p className="detail-count">{playlist.songsCount} songs</p>
          </div>
        </div>

        {/* song list */}
        <ul className="detail-song-list">
          {playlist.songs.map((song, index) => (
            <li key={index} className="detail-song">
              <h3>
                {song.name} — {song.artist}
              </h3>
              {song.note && <p className="detail-note">{song.note}</p>}
            </li>
          ))}
        </ul>

        {/* watermark: only visible while exporting */}
        <div className={`poster-watermark ${isExporting ? "is-visible" : ""}`}>
          © Mood Music · 2025
        </div>
      </div>
    </main>
  );
}