import { Link } from "react-router-dom";

export function PlaylistCard({ playlist }) {
  const songs = playlist.songs || [];
  const recentSongs = songs.slice(0, 2);

  const songItems = recentSongs.map((song) => (
    <li key={song.id || `${playlist.moodId}-${song.name}`}>
      <strong>{song.name}</strong>
      {" — "}
      {song.artist || "Unknown artist"}
      {song.note && <div className="mini-note">{song.note}</div>}
    </li>
  ));

  return (
    <li className="folder-card" data-mood={playlist.moodId}>
      <article>
        <div className="folder-cover">
          <img
            className="cover-img"
            src={playlist.cover}
            alt={`${playlist.title} playlist cover`}
          />
        </div>

        <header className="folder-head">
          <h3 className="folder-title">{playlist.title}</h3>
          <span className="badge">
            {playlist.songsCount ?? 0}{" "}
            {playlist.songsCount === 1 ? "song" : "songs"}
          </span>
        </header>

        {recentSongs.length > 0 && (
          <ul className="song-mini">
            {songItems}
          </ul>
        )}

        <div className="folder-actions">
          <Link
            className="btn btn-primary"
            to={`/playlists/${playlist.moodId}`}
          >
            Open playlist
          </Link>
          <Link
            className="btn btn-ghost"
            to={`/playlists/${playlist.moodId}?mode=export`}
          >
            Export poster
          </Link>
        </div>
      </article>
    </li>
  );
}