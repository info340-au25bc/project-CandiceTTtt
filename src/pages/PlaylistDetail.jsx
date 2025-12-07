// src/pages/PlaylistDetail.jsx

import { useEffect, useRef, useState } from "react";
import {
  useParams,
  useSearchParams,
  useOutletContext,
} from "react-router-dom";
import html2canvas from "html2canvas";
import { getDatabase, ref, onValue } from "firebase/database";
import { playlists as basePlaylists } from "../data/playlists";

export default function PlaylistDetail() {
  const { moodId } = useParams(); // e.g. "Happy", "Angry"
  const [searchParams] = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef(null);
  const { currentUser } = useOutletContext();

  const [songs, setSongs] = useState([]);

  // UI meta 信息（封面、标题）
  const playlistMeta = basePlaylists.find(
    (p) => p.moodId.toLowerCase() === moodId.toLowerCase()
  );

  useEffect(() => {
    if (!currentUser || !currentUser.username) return;

    const db = getDatabase();
    const userRef = ref(db, `users/${currentUser.username}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const val = snapshot.val() || {};
      const list = [];

      // 遍历所有分类，挑出 moodEmojiAlt === moodId 的歌
      Object.entries(val).forEach(([categoryKey, cardsObj]) => {
        if (!cardsObj || typeof cardsObj !== "object") return;

        Object.entries(cardsObj).forEach(([cardId, card]) => {
          const moodName =
            card.moodEmojiAlt || categoryKey || "";
          if (
            moodName &&
            moodName.toLowerCase() === moodId.toLowerCase()
          ) {
            list.push({
              id: cardId,
              ...card,
            });
          }
        });
      });

      list.sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      );

      setSongs(list);
    });

    return () => unsubscribe();
  }, [currentUser, moodId]);

  if (!playlistMeta) {
    return <p style={{ padding: "20px" }}>Playlist not found!</p>;
  }

  async function handleExportPoster() {
    if (!cardRef.current) return;

    try {
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 80));

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${playlistMeta.moodId}-mood-poster.png`;
      link.click();
    } catch (err) {
      console.error("Failed to export poster:", err);
      alert("Oops, something went wrong while exporting the poster.");
    } finally {
      setIsExporting(false);
    }
  }

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "export") {
      handleExportPoster();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container playlist-detail-page">
      <div className="detail-back">
        <a href="/playlists" className="back-btn">
          ← Back to playlists
        </a>
      </div>

      <div
        className="playlist-detail-card"
        data-mood={playlistMeta.moodId}
        ref={cardRef}
      >
        {/* header: icon + title + count */}
        <div className="detail-header">
          <img
            className="detail-icon"
            src={playlistMeta.cover}
            alt={`${playlistMeta.title} mood icon`}
          />
          <div>
            <h2 className="detail-title">{playlistMeta.title}</h2>
            <p className="detail-count">
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>

        {/* song list */}
        <ul className="detail-song-list">
          {songs.map((song) => (
            <li key={song.id} className="detail-song">
              <h3>
                {song.songName} — {song.artist || "Unknown artist"}
              </h3>

              {song.diary && (
                <p className="detail-note">{song.diary}</p>
              )}

              {/* 右下角小字 from xxx（收藏来的歌就会显示原作者） */}
              {song.owner && (
                <p className="detail-from">from {song.owner}</p>
              )}
            </li>
          ))}
        </ul>

        <div className={`poster-watermark ${isExporting ? "is-visible" : ""}`}>
          © Mood Music · 2025
        </div>
      </div>
    </main>
  );
}