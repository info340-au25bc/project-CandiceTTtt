import { Link } from "react-router-dom";

export function PlaylistCard({ playlist }) {
  const recentSongs = playlist.songs.slice(0, 2);

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
          <span className="badge">{playlist.songsCount} songs</span>
        </header>

        <ul className="song-mini">
          {recentSongs.map((song, index) => (
            <li key={index}>
              <strong>{song.name}</strong> — {song.artist}
              {song.note && <div className="mini-note">{song.note}</div>}
            </li>
          ))}
        </ul>

        <div className="folder-actions">
          <Link className="btn btn-primary" to={`/playlists/${playlist.moodId}`}>
            Open playlist
          </Link>
          <Link
            className="btn btn-ghost"
            to={`/playlists/${playlist.moodId}?mode=export`}
          >
            Export Poster
          </Link>
        </div>
      </article>
    </li>
  );
}