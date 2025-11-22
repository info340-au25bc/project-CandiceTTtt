import { useState } from "react";
import { playlists } from "../data/playlists";
import { PlaylistCard } from "../components/PlaylistCard";

export default function MoodPlaylistsPage() {
  const [sortOption, setSortOption] = useState("Recently updated");
  const [viewOption, setViewOption] = useState("Grid");

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleViewChange = (event) => {
    setViewOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const sortedPlaylists = [...playlists].sort((a, b) => {
    if (sortOption === "A → Z") {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === "Z → A") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <main className="container">
      <section className="page-head">
        <h2 className="journal_title">My Mood Playlists</h2>
      </section>

      <section className="controls small-controls">
        <h3 className="visually-hidden">Filters</h3>
        <form onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            name="sort"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option>Recently updated</option>
            <option>A → Z</option>
            <option>Z → A</option>
          </select>

          <label className="visually-hidden" htmlFor="view">
            View
          </label>
          <select
            id="view"
            name="view"
            value={viewOption}
            onChange={handleViewChange}
          >
            <option>Grid</option>
            <option>List</option>
          </select>

          <button type="submit">Apply</button>
        </form>
      </section>

      <section className="mood-book">
        <ul className="book-grid">
          {sortedPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.moodId} playlist={playlist} />
          ))}
        </ul>
      </section>
    </main>
  );
}