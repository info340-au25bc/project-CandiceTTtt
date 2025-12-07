import { useOutletContext } from "react-router-dom";

export default function Settings() {
  const { currentUser, handleLogout } = useOutletContext() || {};

  const username = currentUser?.username || "Guest";

  const moods = [
    { key: "Happy",    img: "happy.PNG",     alt: "Happy" },
    { key: "Sad",      img: "sad.PNG",       alt: "Sad" },
    { key: "Relaxed",  img: "relaxed.PNG",   alt: "Relaxed" },
    { key: "Excited",  img: "excited.PNG",   alt: "Excited" },
    { key: "Confused", img: "confused.PNG",  alt: "Confused" },
    { key: "Lovely",   img: "lovely.PNG",    alt: "Lovely" },
    { key: "Angry",    img: "angry.PNG",     alt: "Angry" },
    { key: "Tired",    img: "exhausted.PNG", alt: "Tired" },
  ];

  return (
    <div className="wall-page container">
      <section className="page-head">
        <h2>Hi, {username} 🎧</h2>
        <p className="subtitle">
          Find your vibe today and tune your mood with personalized settings.
        </p>
      </section>

      <section className="settings-card" aria-labelledby="mood-title">
        <h3 id="mood-title" className="settings-title">Mood Selector</h3>

        <div className="mood-grid">
          {moods.map((m, i) => (
            <label className="mood-tile" key={m.key}>
              <input
                type="radio"
                name="mood"
                className="tile-radio"
                defaultChecked={i === 0}
              />
              <span className="tile-visual">
                <img src={`/shared_imgs/${m.img}`} alt={m.alt} />
              </span>
              <span className="tile-text">{m.key}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="settings-card tabset" aria-labelledby="matchshift-title">
        <h3 id="matchshift-title" className="settings-title">Mood Match / Shift</h3>

        <div className="tabs" role="tablist">
          <label className="tab-pill">
            <input
              type="radio"
              name="mm-mode"
              className="pill-radio"
              defaultChecked
            />
            <span>Match</span>
          </label>
          <label className="tab-pill">
            <input
              type="radio"
              name="mm-mode"
              className="pill-radio"
            />
            <span>Shift</span>
          </label>
        </div>

        <p className="desc">
          Match: songs from the same mood · Shift: songs that lift or change your mood
        </p>

        <div className="panels">
          <div className="panel panel--match" role="tabpanel">
            <div className="song">🎵 “Happy Now” — Kygo</div>
            <div className="song">🎵 “Sunny Days” — Alan Walker</div>
            <div className="song">🎵 “Good Life” — OneRepublic</div>
          </div>

          <div className="panel panel--shift" role="tabpanel">
            <div className="song">🎶 “Calm Down” — Rema</div>
            <div className="song">🎶 “Let It Go” — James Bay</div>
            <div className="song">🎶 “Weightless” — Marconi Union</div>
          </div>
        </div>

        <button className="btn btn-primary" type="button" aria-disabled="true">
          💾 Save as Today’s Playlist
        </button>
      </section>

      <section className="settings-card" aria-labelledby="prefs-title">
        <h3 id="prefs-title" className="settings-title">Preferences</h3>

        <div className="pref">
          <label className="pref-label">Theme</label>
          <select className="pref-select">
            <option>Pastel (Default)</option>
            <option>Dark Lilac</option>
            <option>Mint Cream</option>
          </select>
        </div>

        <div className="pref">
          <label className="pref-label">Data Storage</label>
          <select className="pref-select">
            <option>Local (Browser)</option>
            <option>Cloud (Synced)</option>
          </select>
        </div>

        <label className="toggle">
          <input type="checkbox" className="toggle-ck" defaultChecked />
          <span className="switch" aria-hidden="true"></span>
          <span className="toggle-text">Public mode · Visible to everyone</span>
        </label>

        <button
          className="btn btn-primary logout"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </section>
    </div>
  );
}
