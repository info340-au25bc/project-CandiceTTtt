export function PlaylistCard({ playlist }) {
  return (
    <li className="folder-card" data-mood={playlist.moodId}>
      <article>
        <div className="folder-cover">
          <img
            className="cover-img"
            src={playlist.coverSrc}
            alt={playlist.coverAlt}
          />
        </div>

        <header className="folder-head">
          <h3 className="folder-title">{playlist.title}</h3>
          <span className="badge">{playlist.songCount}</span>
        </header>

        <ul className="song-mini">
          {playlist.songs.map((song, index) => (
            <li key={index}>
              <strong>{song.title}</strong> — {song.artist}
              <div className="mini-note">{song.note}</div>
            </li>
          ))}
        </ul>

        <div className="folder-actions">
          <a className="btn btn-primary" href={playlist.playlistHref}>
            Open playlist
          </a>
          <button className="btn btn-ghost" type="button">
            Export Poster
          </button>
        </div>
      </article>
    </li>
  );
}