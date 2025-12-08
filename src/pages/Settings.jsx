import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDatabase, ref, get, set } from "firebase/database";

export default function Settings() {
  const ctx = useOutletContext() || {};

  const {
    currentUser,
    handleLogout,
    storageMode = "local",
    setStorageMode,
    publicMode = true,
    setPublicMode,
  } = ctx;

  const username = currentUser?.username || "Guest";

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedMood, setSelectedMood] = useState("Happy");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const GENRE_OPTIONS = ["Pop", "Rock", "R&B", "Hip-hop", "Jazz", "Indie", "Classical"];
  const LANG_OPTIONS = ["English", "Chinese", "Korean", "Japanese", "Spanish", "Other"];

  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [favoriteLanguages, setFavoriteLanguages] = useState([]);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsMessage, setPrefsMessage] = useState("");

  const [moodStats, setMoodStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const moods = [
    { key: "Happy",     img: "happy.PNG",      alt: "Happy" },
  { key: "Calm",      img: "calm.PNG",       alt: "Calm" },
  { key: "Relaxed",   img: "relaxed.PNG",    alt: "Relaxed" },
  { key: "Excited",   img: "excited.PNG",    alt: "Excited" },
  { key: "Confused",  img: "confused.PNG",   alt: "Confused" },
  { key: "Lovely",    img: "lovely.PNG",     alt: "Lovely" },
  { key: "Sad",       img: "sad.PNG",        alt: "Sad" },
  { key: "Angry",     img: "angry.PNG",      alt: "Angry" },
  { key: "Tired",     img: "tired.PNG",      alt: "Tired" },       
  { key: "Exhausted", img: "exhausted.PNG",  alt: "Exhausted" },
  ];

  const greetingName = (displayName || "").trim() || username;

  useEffect(() => {
    if (!currentUser || !currentUser.username) return;

    async function loadProfileAndPrefs() {
      setLoadingProfile(true);
      setProfileMessage("");
      setPrefsMessage("");

      try {
        const db = getDatabase();
        const profileRef = ref(db, `users/${currentUser.username}/profile`);
        const prefsRef = ref(db, `users/${currentUser.username}/preferences`);

        const [profileSnap, prefsSnap] = await Promise.all([
          get(profileRef),
          get(prefsRef),
        ]);

        if (profileSnap.exists()) {
          const data = profileSnap.val() || {};
          setDisplayName(data.displayName || "");
          setBio(data.bio || "");
          if (data.favoriteMood) {
            setSelectedMood(data.favoriteMood);
          }
        } else {
          setDisplayName(currentUser.username);
        }

        if (prefsSnap.exists()) {
          const prefs = prefsSnap.val() || {};
          setFavoriteGenres(prefs.favoriteGenres || []);
          setFavoriteLanguages(prefs.favoriteLanguages || []);
        }
      } catch (err) {
        console.error("Failed to load profile / prefs:", err);
        setProfileMessage("Failed to load profile.");
        setPrefsMessage("Failed to load music preferences.");
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfileAndPrefs();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !currentUser.username) return;

    async function loadStats() {
      setLoadingStats(true);
      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${currentUser.username}`);
        const snap = await get(userRef);
        const val = snap.val() || {};

        const perMood = {};
        let total = 0;

        Object.entries(val).forEach(([key, value]) => {
          
          if (
            key === "password" ||
            key === "createdAt" ||
            key === "profile" ||
            key === "preferences"
          ) {
            return;
          }
          if (!value || typeof value !== "object") return;

          const count = Object.keys(value).length;
          if (count > 0) {
            perMood[key] = count;
            total += count;
          }
        });

        setMoodStats({ total, perMood });
      } catch (err) {
        console.error("Failed to load mood stats:", err);
        setMoodStats(null);
      } finally {
        setLoadingStats(false);
      }
    }

    loadStats();
  }, [currentUser]);

  async function handleSaveProfile() {
    if (!currentUser || !currentUser.username) {
      alert("No user — please log in again.");
      return;
    }

    setSavingProfile(true);
    setProfileMessage("");

    try {
      const db = getDatabase();
      const profileRef = ref(db, `users/${currentUser.username}/profile`);

      const payload = {
        displayName: displayName.trim() || currentUser.username,
        bio: bio.trim(),
        favoriteMood: selectedMood,
      };

      await set(profileRef, payload);
      setProfileMessage("Profile saved ✔");
    } catch (err) {
      console.error("Failed to save profile:", err);
      setProfileMessage("Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  function toggleInArray(value, arrSetter) {
    arrSetter((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }

  async function handleSavePreferences() {
    if (!currentUser || !currentUser.username) {
      alert("No user — please log in again.");
      return;
    }

    setSavingPrefs(true);
    setPrefsMessage("");

    try {
      const db = getDatabase();
      const prefsRef = ref(db, `users/${currentUser.username}/preferences`);

      const payload = {
        favoriteGenres,
        favoriteLanguages,
      };

      await set(prefsRef, payload);
      setPrefsMessage("Music preferences saved ✔");
    } catch (err) {
      console.error("Failed to save preferences:", err);
      setPrefsMessage("Failed to save music preferences.");
    } finally {
      setSavingPrefs(false);
    }
  }

  return (
    <div className="wall-page container">
      <section className="page-head">
        <h2>Hi, {greetingName} 🎧</h2>
        <p className="subtitle">
          Find your vibe today and tune your mood with personalized settings.
        </p>
      </section>

      <section className="settings-card" aria-labelledby="mood-title">
        <h3 id="mood-title" className="settings-title">Mood Selector</h3>

        <div className="mood-grid">
          {moods.map((m) => (
            <label className="mood-tile" key={m.key}>
              <input
                type="radio"
                name="mood"
                className="tile-radio"
                checked={selectedMood === m.key}
                onChange={() => setSelectedMood(m.key)}
              />
              <span className="tile-visual">
                <img src={`/shared_imgs/${m.img}`} alt={m.alt} />
              </span>
              <span className="tile-text">{m.key}</span>
            </label>
          ))}
        </div>

        <p className="desc">
          Favorite mood: <strong>{selectedMood}</strong>
        </p>
      </section>

      <section className="settings-card" aria-labelledby="profile-title">
        <h3 id="profile-title" className="settings-title">
          Profile
        </h3>

        <div className="pref">
          <label className="pref-label" htmlFor="display-name-input">
            Display name
          </label>
          <input
            id="display-name-input"
            className="pref-input"
            type="text"
            placeholder={username}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={loadingProfile}
          />
        </div>

        <div className="pref">
          <label className="pref-label" htmlFor="bio-input">
            Bio / status
          </label>
          <textarea
            id="bio-input"
            className="pref-input textarea"
            rows={3}
            placeholder="Write something about your music mood…"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={loadingProfile}
          />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSaveProfile}
          disabled={loadingProfile || savingProfile}
        >
          {savingProfile ? "Saving…" : "Save profile"}
        </button>

        {profileMessage && (
          <p className="settings-hint">{profileMessage}</p>
        )}
      </section>

      <section className="settings-card" aria-labelledby="prefs-music-title">
        <h3 id="prefs-music-title" className="settings-title">
          Music Preferences
        </h3>

        <div className="pref">
          <span className="pref-label">Favorite genres</span>
          <div className="chip-row">
            {GENRE_OPTIONS.map((g) => (
              <label key={g} className="chip">
                <input
                  type="checkbox"
                  checked={favoriteGenres.includes(g)}
                  onChange={() => toggleInArray(g, setFavoriteGenres)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pref">
          <span className="pref-label">Favorite languages</span>
          <div className="chip-row">
            {LANG_OPTIONS.map((lang) => (
              <label key={lang} className="chip">
                <input
                  type="checkbox"
                  checked={favoriteLanguages.includes(lang)}
                  onChange={() => toggleInArray(lang, setFavoriteLanguages)}
                />
                <span>{lang}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSavePreferences}
          disabled={savingPrefs}
        >
          {savingPrefs ? "Saving…" : "Save music preferences"}
        </button>

        {prefsMessage && (
          <p className="settings-hint">{prefsMessage}</p>
        )}
      </section>

      <section className="settings-card" aria-labelledby="stats-title">
        <h3 id="stats-title" className="settings-title">
          Your Mood Stats
        </h3>

        {loadingStats ? (
          <p className="desc">Loading your stats…</p>
        ) : !moodStats || moodStats.total === 0 ? (
          <p className="desc">
            You haven&apos;t created any mood cards yet. Try making one in
            &nbsp;<strong>Create Mood Card</strong>!
          </p>
        ) : (
          <>
            <p className="desc">
              You have created <strong>{moodStats.total}</strong> mood cards.
            </p>
            <ul className="stats-list">
              {Object.entries(moodStats.perMood).map(([mood, count]) => (
                <li key={mood}>
                  <strong>{mood}</strong>: {count} card{count > 1 ? "s" : ""}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="settings-card" aria-labelledby="prefs-title">
        <h3 id="prefs-title" className="settings-title">Preferences</h3>

        <div className="pref">
          <label className="pref-label">Data Storage</label>
          <select
            className="pref-select"
            value={storageMode}
            onChange={(e) => setStorageMode && setStorageMode(e.target.value)}
          >
            <option value="local">Local (Browser)</option>
            <option value="cloud">Cloud (Synced)</option>
          </select>
        </div>

        <label className="toggle">
          <input
            type="checkbox"
            className="toggle-ck"
            checked={publicMode}
            onChange={(e) => setPublicMode && setPublicMode(e.target.checked)}
          />
          <span className="switch" aria-hidden="true"></span>
          <span className="toggle-text">
            Public mode · Visible to everyone
          </span>
        </label>

        <button
          className="btn btn-primary logout"
          type="button"
          onClick={handleLogout}
          disabled={!handleLogout}
        >
          Logout
        </button>
      </section>
    </div>
  );
}
