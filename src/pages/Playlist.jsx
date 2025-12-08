import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useOutletContext } from "react-router-dom";
import { playlists as basePlaylists } from "../data/playlists";
import { PlaylistCard } from "../components/PlaylistCard";

export default function MoodPlaylistsPage() {
  const { currentUser } = useOutletContext();

  const [sortOption, setSortOption] = useState("Recently updated");
  const [viewOption, setViewOption] = useState("Grid");
  const [userMoodsByCategory, setUserMoodsByCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.username) {
      setUserMoodsByCategory({});
      setIsLoading(false);
      setError("Please log in to see your playlists.");
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
        setUserMoodsByCategory(val);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Failed to load user playlists:", err);
        setIsLoading(false);
        setError("Failed to load your playlists. Please try again.");
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const enrichedPlaylists = basePlaylists.map((pl) => {
    const songsForThisPlaylist = [];

    Object.entries(userMoodsByCategory).forEach(
      ([categoryKey, cardsObj]) => {
        if (!cardsObj || typeof cardsObj !== "object") return;

        Object.entries(cardsObj).forEach(([cardId, card]) => {
          const moodName = card.moodEmojiAlt || categoryKey || "";
          if (
            moodName &&
            moodName.toLowerCase() === pl.moodId.toLowerCase()
          ) {
            songsForThisPlaylist.push({
              id: cardId,
              ...card,
            });
          }
        });
      }
    );

    songsForThisPlaylist.sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );

    return {
      ...pl,
      songs: songsForThisPlaylist.map((m) => ({
        id: m.id,
        name: m.songName,
        artist: m.artist,
        note: m.diary,
        owner: m.owner,
      })),
      songsCount: songsForThisPlaylist.length,
      latestCreatedAt: songsForThisPlaylist[0]?.createdAt || 0,
    };
  });

  const sortedPlaylists = [...enrichedPlaylists].sort((a, b) => {
    if (sortOption === "A → Z") {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === "Z → A") {
      return b.title.localeCompare(a.title);
    }
    // 默认：Recently updated
    return (b.latestCreatedAt || 0) - (a.latestCreatedAt || 0);
  });

  const playlistItems = sortedPlaylists.map((playlist) => (
    <PlaylistCard key={playlist.moodId} playlist={playlist} />
  ));

  return (
    <main className="container">
      <section className="page-head">
        <h2 className="journal_title">My Mood Playlists</h2>
      </section>

      {error && (
        <p className="status-message error-message">
          {error}
        </p>
      )}

      {isLoading && !error && (
        <p className="status-message">Loading your playlists…</p>
      )}

      {!isLoading && !error && (
        <section className="mood-book">
          <ul
            className={
              viewOption === "Grid" ? "book-grid" : "book-list"
            }
          >
            {playlistItems}
          </ul>
        </section>
      )}
    </main>
  );
}