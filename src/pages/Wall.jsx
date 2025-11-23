import { useState } from "react";
import { publicPosts } from "../data/publicPosts.js";

const PAGE_SIZE = 6;

export default function WallPage() {
  const [formQuery, setFormQuery] = useState("");
  const [formMood, setFormMood] = useState("");

  const [query, setQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});

  const normalizedQuery = query.toLowerCase().trim();

  const filteredPosts = publicPosts.filter((post) => {
    const matchesMood =
      moodFilter === "" || post.moodKey === moodFilter;

    const haystack = `${post.songTitle} ${post.artist} ${post.diary}`.toLowerCase();
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

  function toggleLike(postId) {
    setLiked((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }

  function toggleSave(postId) {
    setSaved((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }

  return (
    <div className="page wall-page">
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

          {pagePosts.length === 0 ? (
            <p className="wall-empty">
              No posts match your filter ʕง•ᴥ•ʔง <br />
              Try a different mood or search term!
            </p>
          ) : (
            <ul className="wall_container">
              {pagePosts.map((post) => {
                const isLiked = !!liked[post.id];
                const isSaved = !!saved[post.id];

                return (
                  <li
                    key={post.id}
                    className="wall_card"
                    data-mood={post.moodKey}
                  >
                    <article>
                      <div className="wall_card-top">
                        <img
                          className="wall_mood-icon"
                          src={post.iconSrc}
                          alt={post.iconAlt}
                        />
                        <span className="wall_mood-text">
                          {post.moodLabel}
                        </span>
                      </div>

                      <p className="wall_song">
                        {post.songTitle}
                        <span className="artist">
                          {" "}
                          — {post.artist}
                        </span>
                      </p>

                      <p className="wall_diary">{post.diary}</p>

                      <div className="wall_actions">
                        <button
                          className={
                            "icon-btn like-btn" +
                            (isLiked ? " is-active" : "")
                          }
                          type="button"
                          onClick={() => toggleLike(post.id)}
                          aria-pressed={isLiked}
                          title={
                            isLiked
                              ? "Unlike this post"
                              : "Like this post"
                          }
                          aria-label={
                            isLiked
                              ? "Unlike this post"
                              : "Like this post"
                          }
                        >
                          <span
                            className={
                              "material-symbols-outlined fav-icon" +
                              (isLiked ? " is-on" : " is-off")
                            }
                            aria-hidden="true"
                          >
                            favorite
                          </span>
                        </button>

                        <button
                          className={
                            "icon-btn save-btn" +
                            (isSaved ? " is-active" : "")
                          }
                          type="button"
                          onClick={() => toggleSave(post.id)}
                          aria-pressed={isSaved}
                          title={
                            isSaved
                              ? "Unsave this post"
                              : "Save this post"
                          }
                          aria-label={
                            isSaved
                              ? "Unsave this post"
                              : "Save this post"
                          }
                        >
                          <span
                            className={
                              "material-symbols-outlined star-icon" +
                              (isSaved ? " is-on" : " is-off")
                            }
                            aria-hidden="true"
                          >
                            grade
                          </span>
                        </button>

                        <button
                          className="icon-btn"
                          type="button"
                          title="Download this post"
                          aria-label="Download this post"
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