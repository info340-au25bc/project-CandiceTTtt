import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { useOutletContext } from "react-router-dom";

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
  const [tag, setTag] = useState("");

  
  async function handleSave() {
    if (!songName.trim()) {
      alert("Please enter a song name.");
      return;
    }

    if (!currentUser || !currentUser.username) {
      alert("No user found — please login again.");
      return;
    }

    try {
      const db = getDatabase();
      const moodsRef = ref(db, "moods");

      const newCard = {
        moodEmojiSrc: selectedMood.src,
        moodEmojiAlt: selectedMood.alt,
        songName: songName.trim(),
        artist: artist.trim(),
        link: link.trim(),
        diary: diary.trim(),
        isPublic,
        tag,
        createdAt: Date.now(),
        owner: currentUser.username, 
      };

      await push(moodsRef, newCard);
      alert("Mood card saved! 🎉");

      handleClear();
    } catch (err) {
      console.error(err);
      alert("Failed to save — check console.");
    }
  }


  function handleClear() {
    setSongName("");
    setArtist("");
    setLink("");
    setDiary("");
    setTag("");
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

    
        <section className="card" aria-label="MoodForm">
          <div className="card-head">
            <h2>
              Input <span className="badge">MoodForm</span>
            </h2>
          </div>

          
          <div className="field">
            <span className="lbl">Mood Icon (click to select)</span>
            <div className="emoji-grid">
              {moodIcons.map((m) => (
                <label className="emoji" key={m.alt}>
                  <input
                    type="radio"
                    name="mood"
                    className="emoji-radio"
                    checked={selectedMood.src === m.src}
                    onChange={() => setSelectedMood(m)}
                  />
                  <img src={m.src} alt={m.alt} />
                </label>
              ))}
            </div>
          </div>

        
          <div className="row">
            <label className="field">
              <span className="lbl">Song Name</span>
              <input
                type="text"
                className="ipt"
                placeholder="Song name"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="lbl">Artist</span>
              <input
                type="text"
                className="ipt"
                placeholder="Artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </label>
          </div>

       
          <label className="field">
            <span className="lbl">Optional Link (YouTube / Spotify)</span>
            <input
              type="url"
              className="ipt"
              placeholder="https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </label>

    
          <label className="field">
            <span className="lbl">Short Diary (optional)</span>
            <textarea
              className="ipt textarea"
              placeholder="Write a little note…"
              value={diary}
              onChange={(e) => setDiary(e.target.value)}
            />
          </label>

   
          <div className="row">
            <div className="field">
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
            </div>

            <label className="field">
              <span className="lbl">Tag (optional)</span>
              <select
                className="ipt select"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="">None</option>
                <option>Study</option>
                <option>Commute</option>
                <option>Bedtime</option>
                <option>Running</option>
                <option>Chill</option>
              </select>
            </label>
          </div>

       
          <div className="actions">
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-ghost" onClick={handleClear}>
              Clear
            </button>
          </div>
        </section>

    
        <section className="card" aria-label="MoodCardPreview">
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
              <span className="pill">{isPublic ? "Public" : "Private"}</span>
            </div>

            <p className="song">
              {songName || "No song yet"}{" "}
              <small className="by">by {artist || "Artist"}</small>
            </p>

            <p className="meta">
              🔗 {link || "Link"} · 🏷️ {tag || "Tag"}
            </p>

            <div className="diary">
              {diary || "Write a little diary. It will show here."}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}






