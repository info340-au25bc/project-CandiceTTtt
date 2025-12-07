import { useEffect, useRef, useState } from "react";
import {
  useParams,
  useSearchParams,
  useOutletContext,
  Link, 
} from "react-router-dom";
import html2canvas from "html2canvas";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { playlists as basePlaylists } from "../data/playlists";

export default function PlaylistDetail() {
  const { moodId } = useParams(); 
  const [searchParams] = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef(null);
  const { currentUser } = useOutletContext();

  const [songs, setSongs] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null); 

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

      Object.entries(val).forEach(([categoryKey, cardsObj]) => {
        if (!cardsObj || typeof cardsObj !== "object") return;

        Object.entries(cardsObj).forEach(([cardId, card]) => {
          const moodName = card.moodEmojiAlt || categoryKey || "";
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

      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setSongs(list);
    });

    return () => unsubscribe();
  }, [currentUser, moodId]);

  if (!playlistMeta) {
    return <p style={{ padding: "20px" }}>Playlist not found!</p>;
  }

  // 导出海报
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
  }, []);

  function onClickDelete(song) {
    setPendingDelete(song);
  }

  async function confirmDelete() {
    if (!pendingDelete || !currentUser) return;

    try {
      const db = getDatabase();
      const username = currentUser.username;
      const moodCategory = pendingDelete.moodEmojiAlt || moodId;

      const userSongRef = ref(
        db,
        `users/${username}/${moodCategory}/${pendingDelete.id}`
      );
      await remove(userSongRef);

      if (pendingDelete.owner === username) {
        const wallRef = ref(db, `moods/${pendingDelete.id}`);
        await remove(wallRef);
      }

      setPendingDelete(null);
      // onValue 监听会自动刷新 songs，不用手动 setSongs
    } catch (err) {
      console.error("Failed to delete card:", err);
      alert("Failed to delete. Please try again.");
    }
  }

  function cancelDelete() {
    setPendingDelete(null);
  }

  return (
    <main className="container playlist-detail-page">
      <div className="detail-back">
        <Link to="/playlists" className="back-btn">
          ← Back to playlists
        </Link>
      </div>

      <div
        className="playlist-detail-card"
        data-mood={playlistMeta.moodId}
        ref={cardRef}
      >
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

        <ul className="detail-song-list">
          {songs.map((song) => (
            <li key={song.id} className="detail-song">
              <h3>
                {song.songName} — {song.artist || "Unknown artist"}
              </h3>

              {song.diary && (
                <p className="detail-note">{song.diary}</p>
              )}

              <div className="detail-bottom-row">
                <button
                  type="button"
                  className="detail-delete-btn"
                  onClick={() => onClickDelete(song)} 
                  aria-label="Delete this mood card"
                  title="Delete this mood card"
                >
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                  >
                    delete
                  </span>
                </button>

                {song.owner && (
                  <p className="detail-from">
                    from <span className="detail-from-name">{song.owner}</span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div
          className={`poster-watermark ${
            isExporting ? "is-visible" : ""
          }`}
        >
          © Mood Music · 2025
        </div>
      </div>

      {pendingDelete && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3 className="modal-title">Ready to delete?</h3>
            <p className="modal-text">
              This will remove this song from your playlist
              {pendingDelete.owner === currentUser.username
                ? " and the public wall."
                : "."}
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={cancelDelete}
              >
                No, keep it
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-danger"
                onClick={confirmDelete}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}