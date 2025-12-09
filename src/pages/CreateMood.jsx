import React, { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
import { useOutletContext } from "react-router-dom";
import { ClipLoader } from "react-spinners";  

export default function CreateMoodPage() {
  const { currentUser } = useOutletContext();

  const [selectedMood, setSelectedMood] = useState({
    src: "/shared_imgs/happy.PNG",
    alt: "Happy",
  });

  const [songName, setSongName] = useState("");
  const [artist, setArtist] = useState("");
  const [link, setLink] = useState("");
  const [diary, setDiary] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [isSaving, setIsSaving] = useState(false);  
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [lastSavedIsPublic, setLastSavedIsPublic] = useState(true);
  const [error, setError] = useState(null);  

  async function handleSave() {
    
    if (!songName.trim()) {
      setError("Please enter a song name.");
      return;
    }

    if (!currentUser || !currentUser.username) {
      setError("No user — please log in again.");
      return;
    }

    setIsSaving(true);
    setError(null);  

    try {
      const db = getDatabase();

      const newCard = {
        moodEmojiSrc: selectedMood.src,
        moodEmojiAlt: selectedMood.alt,
        songName: songName.trim(),
        artist: artist.trim(),
        link: link.trim(),
        diary: diary.trim(),
        isPublic,
        createdAt: Date.now(),
        owner: currentUser.username,
      };

      const moodRef = ref(db, "moods");
      const newMoodPush = await push(moodRef, newCard);
      const cardId = newMoodPush.key;

      const moodCategory = selectedMood.alt;
      const userCardRef = ref(db, `users/${currentUser.username}/${moodCategory}/${cardId}`);
      await set(userCardRef, newCard);

      setLastSavedIsPublic(isPublic);
      setSaveModalOpen(true);
      handleClear();  
    } catch (error) {
      console.error(error);
      setError("Save Failed. Please try again.");
    } finally {
      setIsSaving(false);  
    }
  }

  function handleClear() {
    setSongName("");
    setArtist("");
    setLink("");
    setDiary("");
    setIsPublic(true);
    setSelectedMood({
      src: "/shared_imgs/happy.PNG",
      alt: "Happy",
    });
  }

  const moodIcons = [
    { src: "/shared_imgs/happy.PNG", alt: "Happy" },
    { src: "/shared_imgs/angry.PNG", alt: "Angry" },
    { src: "/shared_imgs/calm.PNG", alt: "Calm" },
    { src: "/shared_imgs/confused.PNG", alt: "Confused" },
    { src: "/shared_imgs/excited.PNG", alt: "Excited" },
    { src: "/shared_imgs/exhausted.PNG", alt: "Exhausted" },
    { src: "/shared_imgs/lovely.PNG", alt: "Lovely" },
    { src: "/shared_imgs/relaxed.PNG", alt: "Relaxed" },
    { src: "/shared_imgs/sad.PNG", alt: "Sad" },
    { src: "/shared_imgs/tired.PNG", alt: "Tired" },
  ];

  return (
    <div className="page">
      <main className="grid">
        <section className="card">
          <div className="card-head">
            <h2>
              Input <span className="badge">MoodForm</span>
            </h2>
          </div>

          {error && (
            <div className="modal-backdrop" role="dialog" aria-modal="true">
              <div className="modal-card error-modal">
                <h3 className="modal-title">Error!</h3>
                <p className="modal-text">{error}</p>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-btn modal-btn-danger"
                    onClick={() => setError(null)}  
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="field">
            <span className="lbl">Mood Icon</span>
            <div className="emoji-grid">
              {moodIcons.map((m) => (
                <label key={m.alt} className="emoji">
                  <input
                    type="radio"
                    name="mood"
                    className="tile-radio"
                    checked={selectedMood.src === m.src}
                    onChange={() => setSelectedMood(m)}
                  />
                  <img src={m.src} alt={m.alt} />
                  <span>{m.alt}</span> 
                </label>
              ))}
            </div>
          </div>

          <div className="row">
            <label className="field">
              <span className="lbl">Song Name</span>
              <input
                className="ipt"  
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="lbl">Artist</span>
              <input
                className="ipt"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </label>
          </div>

          <label className="field">
            <span className="lbl">Optional Link</span>
            <input
              className="ipt"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="lbl">Diary</span>
            <textarea
              className="ipt textarea"
              value={diary}
              onChange={(e) => setDiary(e.target.value)}
            />
          </label>

          <div className="row">
            <label className="field">
              <span className="lbl">Public / Private</span>
              <label className="toggle">
                <input
                  type="checkbox"
                  className="toggle-ck"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <span className="switch" />
                <span className="toggle-text">
                  {isPublic ? "Public" : "Private"}
                </span>
              </label>
            </label>
          </div>

          <div className="actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <ClipLoader color="#ffffff" loading={true} size={20} />  
              ) : (
                "Save"
              )}
            </button>
            <button className="btn btn-ghost" onClick={handleClear}>
              Clear
            </button>
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>
              Preview <span className="badge">MoodCardPreview</span>
            </h2>
          </div>

          <div className="mood-card">
            <div className="mood-head">
              <div className="mood-emoji">
                <img src={selectedMood.src} alt={selectedMood.alt} />
              </div>
              <span className="pill">
                {isPublic ? "Public" : "Private"}
              </span>
            </div>

            <p className="song">
              {songName || "No song"}{" "}
              <small>by {artist || "Artist"}</small>
            </p>

            <p className="meta">🔗 {link || "Link"}</p>

            <div className="diary">
              {diary || "Write a little diary…"}
            </div>
          </div>
        </section>
      </main>

      
      {saveModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 className="modal-title">Mood saved! ✨</h3>
            <p className="modal-text">
              Your mood card has been saved to your playlist
              {lastSavedIsPublic
                ? " and shared on the Public Wall."
                : " as a private card just for you."}
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-danger"
                onClick={() => setSaveModalOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
