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
  const { currentUser } = useOutletContext();

  const cardRef = useRef(null);

  const [songs, setSongs] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const playlistMeta = basePlaylists.find(
    (p) => p.moodId.toLowerCase() === moodId.toLowerCase()
  );

  function getSongLinkUrl(rawLink) {
    if (!rawLink) return "";
    const trimmed = rawLink.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return "https://" + trimmed;
  }

  useEffect(() => {
    if (!playlistMeta) {
      setIsLoading(false);
      setError("Playlist not found.");
      return;
    }

    if (!currentUser || !currentUser.username) {
      setSongs([]);
      setIsLoading(false);
      setError("Please log in to see this playlist.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const db = getDatabase();
    const userRef = ref(db, `users/${currentUser.username}`);

    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
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
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Failed to load playlist songs:", err);
        setIsLoading(false);
        setError("Failed to load songs. Please try again.");
      }
    );

    return () => unsubscribe();
  }, [currentUser, moodId, playlistMeta]);

  async function handleExportPoster() {
    if (!cardRef.current || !playlistMeta) return;

    try {
      setIsExporting(true);
      setError(null);

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
      setError(
        "Something went wrong while exporting the poster. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
  }

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "export") {
      handleExportPoster();
    }
  }, [searchParams]);

  function onClickDelete(song) {
    setError(null);
    setPendingDelete(song);
  }

  async function confirmDelete() {
    if (!pendingDelete || !currentUser) return;

    try {
      setIsDeleting(true);
      setError(null);

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
      setIsDeleting(false);
    } catch (err) {
      console.error("Failed to delete card:", err);
      setIsDeleting(false);
      setError("Failed to delete this card. Please try again.");
    }
  }

  function cancelDelete() {
    setPendingDelete(null);
    setIsDeleting(false);
  }

  if (!playlistMeta) {
    return (
      <main className="container playlist-detail-page">
        <div className="detail-back">
          <Link to="/playlists" className="back-btn">
            ← Back to playlists
          </Link>
        </div>
        <p className="status-message error-message">
          Playlist not found.
        </p>
      </main>
    );
  }

  const songItems = songs.map((song) => {
    const songUrl = getSongLinkUrl(song.link);

    return (
      <li key={song.id} className="detail-song">
        <h3 className="detail-song-top">
          <span>
            {song.songName} — {song.artist || "Unknown artist"}
          </span>

          {songUrl && (
            <a
              href={songUrl}
              className="detail-song-link icon-btn"
              target="_blank"
              rel="noreferrer"
              aria-label="Open song link"
            >
              <span className="material-symbols-outlined">link</span>
            </a>
          )}
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
              from{" "}
              <span className="detail-from-name">
                {song.owner}
              </span>
            </p>
          )}
        </div>
      </li>
    );
  });

  return (
    <main className="container playlist-detail-page">
      <div className="detail-back">
        <Link to="/playlists" className="back-btn">
          ← Back to playlists
        </Link>
      </div>

      {error && (
        <p className="status-message error-message">
          {error}
        </p>
      )}

      {isLoading && !error && (
        <p className="status-message">Loading your songs…</p>
      )}

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
          {songItems}
        </ul>

        {!isLoading && !error && songs.length === 0 && (
          <p className="status-message empty-playlist">
            No songs in this mood yet. Try creating new mood cards ✨
          </p>
        )}

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
                disabled={isDeleting}
              >
                No, keep it
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-danger"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}