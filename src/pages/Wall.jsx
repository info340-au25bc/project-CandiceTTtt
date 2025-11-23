// src/pages/Wall.jsx
import { useState } from "react";
import { publicPosts } from "../data/publicPosts.js";

const PAGE_SIZE = 6;

export default function WallPage() {
  // 表单里正在输入的值
  const [formQuery, setFormQuery] = useState("");
  const [formMood, setFormMood] = useState("");

  // 真正用于筛选 + 分页的值
  const [query, setQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("");

  // 当前页
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedQuery = query.toLowerCase().trim();

  // 先做搜索 + mood 筛选
  const filteredPosts = publicPosts.filter((post) => {
    const matchesMood =
      moodFilter === "" || post.moodKey === moodFilter;

    const haystack = `${post.songTitle} ${post.artist} ${post.diary}`.toLowerCase();
    const matchesQuery =
      normalizedQuery === "" || haystack.includes(normalizedQuery);

    return matchesMood && matchesQuery;
  });

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE) || 1;

  // 防止当前页超过最大页
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagePosts = filteredPosts.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // 点 Apply 的时候才真正更新筛选条件
  function handleSubmit(event) {
    event.preventDefault();
    setQuery(formQuery);
    setMoodFilter(formMood);
    setCurrentPage(1);
  }

  // 输入框 / 下拉框只更新“表单里的值”
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

  return (
    <div className="page wall-page">
      <main className="container">
        {/* 标题 */}
        <section className="page-head">
          <h2>Public Wall</h2>
          <p className="subtitle">
            Browse everyone&apos;s mood &amp; music posts.
          </p>
        </section>

        {/* 搜索 + mood filter */}
        <section
          className="controls small-controls"
          aria-label="Filters"
        >
          <h3 className="visually-hidden">Filters</h3>
          <form onSubmit={handleSubmit}>
            <input
              className="q"
              name="q"
              type="search"
              placeholder="Search songs or notes"
              value={formQuery}
              onChange={handleQueryChange}
            />

            <select
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

            <button type="submit" className="apply-btn">Apply</button>

          </form>
        </section>

        {/* 卡片列表（当前页的数据） */}
        <section
          className="wall-section"
          aria-label="All posts on public wall"
        >
          <h3 className="visually-hidden">All posts</h3>

          {pagePosts.length === 0 ? (
            <p className="wall-empty">No posts match your filter ʕง•ᴥ•ʔง <br />Try a different mood or search term!</p>

          ) : (
            <ul className="wall_container">
              {pagePosts.map((post) => (
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
                        className="icon-btn like-btn"
                        type="button"
                        title="Like"
                      >
                        <span className="material-symbols-outlined fav-icon">
                          favorite
                        </span>
                      </button>
                      <button
                        className="icon-btn save-btn"
                        type="button"
                        title="Save"
                      >
                        <span className="material-symbols-outlined">
                          star
                        </span>
                      </button>
                      <button
                        className="icon-btn"
                        type="button"
                        title="Download"
                      >
                        <span className="material-symbols-outlined">
                          download
                        </span>
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}

          {/* 自动分页 */}
          <div className="wall_pagination">
            <button
              className="page-btn"
              type="button"
              title="Previous"
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
              title="Next"
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
