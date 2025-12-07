import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
} from "firebase/database";
import html2canvas from "html2canvas";

const PAGE_SIZE = 6;

export default function WallPage() {
  const { currentUser } = useOutletContext();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [formQuery, setFormQuery] = useState("");
  const [formMood, setFormMood] = useState("");

  const [query, setQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [savedMap, setSavedMap] = useState({});

  const cardRefs = useRef({});

  const [wallModalOpen, setWallModalOpen] = useState(false);
  const [wallModalMessage, setWallModalMessage] = useState("");

  useEffect(() => {
    const db = getDatabase();
    const moodsRef = ref(db, "moods");

    const unsubscribe = onValue(
      moodsRef,
      (snapshot) => {
        const val = snapshot.val() || {};
        const list = Object.entries(val)
          .map(([id, card]) => ({
            id,
            ...card,
          }))
          .filter((card) => card.isPublic);

        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setPosts(list);
        setIsLoading(false);
        setLoadError(null);
      },
      (error) => {
        console.error("Error loading moods:", error);
        setLoadError("Failed to load posts. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser || !currentUser.username) return;

    const db = getDatabase();
    const userRef = ref(db, `users/${currentUser.username}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const val = snapshot.val() || {};
      const map = {};

      Object.entries(val).forEach(([key, value]) => {
        if (
          key === "password" ||
          key === "createdAt" ||
          typeof value !== "object"
        ) {
          return;
        }

        Object.keys(value).forEach((cardId) => {
          map[cardId] = true;
        });
      });

      setSavedMap(map);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const normalizedQuery = query.toLowerCase().trim();

  const filteredPosts = posts.filter((post) => {
    const moodKey = (post.moodEmojiAlt || "").toLowerCase();

    const matchesMood =
      moodFilter === "" || moodKey === moodFilter;

    const haystack = `${post.songName || ""} ${
      post.artist || ""
    } ${post.diary || ""}`.toLowerCase();

    const matchesQuery =
      normalizedQuery === "" || haystack.includes(normalizedQuery);

    return matchesMood && matchesQuery;
  });

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagePosts = filteredPosts.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  function handleSubmit(event) {
    event.preventDefault();
    setQuery(formQuery);
    setMoodFilter(formMood);
    setCurrentPage(1);
  }

  function handleQueryChange(event) {
    setFormQuery(event.target.value);
  }

  function handleMoodChange(event) {
    setFormMood(event.target.value);
  }

  function goPrevPage() {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }

  function goNextPage() {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }

  async function handleToggleSave(post) {
    if (!currentUser || !currentUser.username) {
      alert("Please log in first.");
      return;
    }

    const username = currentUser.username;
    const isOwn =
      post.owner &&
      post.owner.toLowerCase() === username.toLowerCase();

    if (isOwn) {
      setWallModalMessage(
        "This is your own post and it is already in your playlist!"
      );
      setWallModalOpen(true);
      return;
    }

    const db = getDatabase();
    const moodCategory = post.moodEmojiAlt || "Other";
    const cardId = post.id;
    const userCardRef = ref(
      db,
      `users/${username}/${moodCategory}/${cardId}`
    );

    if (savedMap[cardId]) {
      try {
        await remove(userCardRef);
        setWallModalMessage("Removed from your playlist.");
        setWallModalOpen(true);
      } catch (err) {
        console.error("Failed to unsave:", err);
        alert("Failed to unsave this post.");
      }
      return;
    }

    try {
      const { id, ...rest } = post;
      const cardToSave = {
        ...rest,
        isPublic: false,
      };
      await set(userCardRef, cardToSave);
      setWallModalMessage("Yay! Successfully added to your playlist!");
      setWallModalOpen(true);
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save this post.");
    }
  }

  async function handleDownload(cardId, moodLabel) {
    const el = cardRefs.current[cardId];
    if (!el) return;

    try {
      const canvas = await html2canvas(el, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${moodLabel || "mood"}-card.png`;
      link.click();
    } catch (err) {
      console.error("Failed to download card:", err);
      alert("Failed to download this card.");
    }
  }

  return (
    <div className="page wall-page">
      {wallModalOpen && (
        <div
          className="wall-modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="wall-modal">
            <p className="wall-modal-message">{wallModalMessage}</p>
            <button
              type="button"
              className="wall-modal-close-btn"
              onClick={() => setWallModalOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <main className="container">
        <section className="page-head">
          <h2>Public Wall</h2>
          <p className="subtitle">
            Browse everyone&apos;s mood &amp; music posts.
          </p>
        </section>

        <section
          className="controls small-controls"
          aria-labelledby="wall-filters-heading"
        >
          <h3 id="wall-filters-heading" className="visually-hidden">
            Filter public wall posts
          </h3>

          <form onSubmit={handleSubmit}>
            <label
              className="visually-hidden"
              htmlFor="wall-search-input"
            >
              Search by song, artist, or diary text
            </label>
            <input
              id="wall-search-input"
              className="q"
              name="q"
              type="search"
              placeholder="Search songs or notes"
              value={formQuery}
              onChange={handleQueryChange}
            />

            <label
              className="visually-hidden"
              htmlFor="wall-mood-select"
            >
              Filter by mood
            </label>
            <select
              id="wall-mood-select"
              className="mood"
              name="mood"
              value={formMood}
              onChange={handleMoodChange}
            >
              <option value="">All moods</option>
              <option value="happy">Happy</option>
              <option value="calm">Calm</option>
              <option value="lovely">Lovely</option>
              <option value="excited">Excited</option>
              <option value="sad">Sad</option>
              <option value="relaxed">Relaxed</option>
              <option value="angry">Angry</option>
              <option value="confused">Confused</option>
              <option value="tired">Tired</option>
              <option value="exhausted">Exhausted</option>
            </select>

            <button type="submit" className="apply-btn">
              Apply
            </button>
          </form>
        </section>

        <section
          className="wall-section"
          aria-labelledby="wall-posts-heading"
        >
          <h3 id="wall-posts-heading" className="visually-hidden">
            All public posts
          </h3>

          {isLoading ? (
            <p className="wall-empty">Loading posts...</p>
          ) : loadError ? (
            <p className="wall-empty">{loadError}</p>
          ) : pagePosts.length === 0 ? (
            <p className="wall-empty">
              No posts match your filter ʕง•ᴥ•ʔง <br />
              Try a different mood or search term!
            </p>
          ) : (
            <ul className="wall_container">
              {pagePosts.map((post) => {
                const moodKey = (post.moodEmojiAlt || "").toLowerCase();

                const isOwn =
                  currentUser &&
                  post.owner &&
                  post.owner.toLowerCase() ===
                    currentUser.username.toLowerCase();

                const isSaved = isOwn || !!savedMap[post.id];

                return (
                  <li
                    key={post.id}
                    className="wall_card"
                    data-mood={moodKey}
                  >
                    <article
                      ref={(el) => {
                        if (el) {
                          cardRefs.current[post.id] = el;
                        }
                      }}
                    >
                      <div className="wall_card-top">
                        <img
                          className="wall_mood-icon"
                          src={post.moodEmojiSrc}
                          alt={post.moodEmojiAlt}
                        />
                        <span className="wall_mood-text">
                          {post.moodEmojiAlt}
                        </span>
                      </div>

                      <p className="wall_song">
                        {post.songName}
                        {post.artist && (
                          <span className="artist">
                            {" "}
                            — {post.artist}
                          </span>
                        )}
                      </p>

                      <p className="wall_diary">{post.diary}</p>

                      {post.owner && (
                        <p className="wall_owner">
                          — From {post.owner}
                        </p>
                      )}

                      <div className="wall_actions">
                        <button
                          className={
                            "icon-btn wall-save-btn" +
                            (isSaved ? " wall-save-btn--active" : "")
                          }
                          type="button"
                          onClick={() => handleToggleSave(post)}
                          aria-pressed={isSaved}
                          title={
                            isOwn
                              ? "This is your own post."
                              : isSaved
                              ? "Unsave this post"
                              : "Save this post"
                          }
                          aria-label={
                            isOwn
                              ? "This is your own post."
                              : isSaved
                              ? "Unsave this post"
                              : "Save this post"
                          }
                        >
                          <span
                            className={
                              "material-symbols-outlined wall-star-icon" +
                              (isSaved ? " wall-star-icon--on" : "")
                            }
                            aria-hidden="true"
                          >
                            grade
                          </span>
                        </button>

                        <button
                          className="icon-btn wall-download-btn"
                          type="button"
                          title="Download this post"
                          aria-label="Download this post"
                          onClick={() =>
                            handleDownload(post.id, post.moodEmojiAlt)
                          }
                        >
                          <span
                            className="material-symbols-outlined"
                            aria-hidden="true"
                          >
                            download
                          </span>
                        </button>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="wall_pagination">
            <button
              className="page-btn"
              type="button"
              title="Previous page"
              aria-label="Previous page"
              onClick={goPrevPage}
              disabled={safePage === 1}
            >
              ⟨
            </button>
            <span className="page-status">
              Page {safePage} of {totalPages}
            </span>
            <button
              className="page-btn"
              type="button"
              title="Next page"
              aria-label="Next page"
              onClick={goNextPage}
              disabled={safePage === totalPages}
            >
              ⟩
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
