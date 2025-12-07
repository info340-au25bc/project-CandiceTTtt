import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";

export default function CreateMoodPage() {
  // 当前选中的表情
  const [selectedMood, setSelectedMood] = useState({
    src: "/shared_imgs/happy.PNG",
    alt: "Happy",
  });

  // 表单字段
  const [songName, setSongName] = useState("");
  const [artist, setArtist] = useState("");
  const [link, setLink] = useState("");
  const [diary, setDiary] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [tag, setTag] = useState("");

  // 保存到 Realtime Database
  async function handleSave() {
    if (!songName.trim()) {
      alert("Please enter a song name before saving.");
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
      };

      await push(moodsRef, newCard);
      alert("Mood card saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save mood card. Check console for details.");
    }
  }

  // 清空表单+预览
  function handleClear() {
    setSongName("");
    setArtist("");
    setLink("");
    setDiary("");
    setIsPublic(true);
    setTag("");
    setSelectedMood({ src: "/shared_imgs/happy.PNG", alt: "Happy" });
  }

  return (
    <div className="page">
      <main className="grid">
        {/* Left: MoodForm */}
        <section className="card" aria-label="Input · MoodForm">
          <div className="card-head">
            <h2>
              Input <span className="badge">MoodForm</span>
            </h2>
          </div>

          {/* Mood icons */}
          <div className="field">
            <span className="lbl">Mood Icon (click to select)</span>
            <div className="emoji-grid">
              {/* Happy */}
              <label className="emoji">
                <input
                  type="radio"
                  name="mood"
                  className="emoji-radio"
                  checked={selectedMood.src === "/shared_imgs/happy.PNG"}
                  onChange={() =>
                    setSelectedMood({
                      src: "/shared_imgs/happy.PNG",
                      alt: "Happy",
                    })
                  }
                />
                <img src="/shared_imgs/happy.PNG" alt="Happy" />
              </label>

              {/* Angry */}
              <label className="emoji">
                <input
                  type="radio"
                  name="mood"
                  className="emoji-radio"
                  checked={selectedMood.src === "/shared_imgs/angry.PNG"}
                  onChange={() =>
                    setSelectedMood({
                      src: "/shared_imgs/angry.PNG",
                      alt: "Angry",
                    })
                  }
                />
                <img src="/shared_imgs/angry.PNG" alt="Angry" />
              </label>

              {/* Calm */}
              <label className="emoji">
                <input
                  type="radio"
                  name="mood"
                  className="emoji-radio"
                  checked={selectedMood.src === "/shared_imgs/calm.PNG"}
                  onChange={() =>
                    setSelectedMood({
                      src: "/shared_imgs/calm.PNG",
                      alt: "Calm",
                    })
                  }
                />
                <img src="/shared_imgs/calm.PNG" alt="Calm" />
              </label>

              {/* Confused */}
              <label className="emoji">
                <input
                  type="radio"
                  name="mood"
                  className="emoji-radio"
                  checked={selectedMood.src === "/shared_imgs/confused.PNG"}
                  onChange={() =>
                    setSelectedMood({
                      src: "/shared_imgs/confused.PNG",
                      alt: "Confused",
                    })
                  }
                />
                <img src="/shared_imgs/confused.PNG" alt="Confused" />
              </label>

              {/* Excited */}
              <label className="emoji">
                <input
                  type="radio"
                  name="mood"
                  className="emoji-radio"
                  checked={selectedMood.src === "/shared_imgs/excited.PNG"}
                  onChange={() =>
                    setSelectedMood({
                      src: "/shared_imgs/excited.PNG",
                      alt: "Excited",
                    })
                  }
                />
                <img src="/shared_imgs/excited.PNG" alt="Excited" />
              </label>

              {/* Exhausted */}
              <label className="emoji">
                <input
                  type="radio"
                  name="mood"
                  className="emoji-radio"
                  checked={selectedMood.src === "/shared_imgs/exhausted.PNG"}
                  onChange={() =>
                    setSelectedMood({
                      src: "/shared_imgs/exhausted.PNG",
                      alt: "Exhausted",
                    })
                  }
                />
                <img src="/shared_imgs/exhausted.PNG" alt="Exhausted" />
              </label>

              {/* Lovely */}
              <label className="emoji">
                <input
                  type="radio"
                  name="mood"
                  className="emoji-radio"
                  checked={selectedMood.src === "/shared_imgs/lovely.PNG"}
                  onChange={() =>
                    setSelectedMood({
                      src: "/shared_imgs/lovely.PNG",
                      alt: "Lovely",
                    })
                  }
                />
                <img src="/shared_imgs/lovely.PNG" alt="Lovely" />
              </label>

              {/* Relaxed */}
              <label className="emoji">
                <input
                  type="radio"
                  name="mood"
                  className="emoji-radio"
                  checked={selectedMood.src === "/shared_imgs/relaxed.PNG"}
                  onChange={() =>
                    setSelectedMood({
                      src: "/shared_imgs/relaxed.PNG",
                      alt: "Relaxed",
                    })
                  }
                />
                <img src="/shared_imgs/relaxed.PNG" alt="Relaxed" />
              </label>

              {/* Sad */}
              <label className="emoji">
                <input
                  type="radio"
                  name="mood"
                  className="emoji-radio"
                  checked={selectedMood.src === "/shared_imgs/sad.PNG"}
                  onChange={() =>
                    setSelectedMood({
                      src: "/shared_imgs/sad.PNG",
                      alt: "Sad",
                    })
                  }
                />
                <img src="/shared_imgs/sad.PNG" alt="Sad" />
              </label>

              {/* Tired */}
              <label className="emoji">
                <input
                  type="radio"
                  name="mood"
                  className="emoji-radio"
                  checked={selectedMood.src === "/shared_imgs/tired.PNG"}
                  onChange={() =>
                    setSelectedMood({
                      src: "/shared_imgs/tired.PNG",
                      alt: "Tired",
                    })
                  }
                />
                <img src="/shared_imgs/tired.PNG" alt="Tired" />
              </label>
            </div>
          </div>

          <div className="row">
            <label className="field">
              <span className="lbl">Song Name</span>
              <input
                type="text"
                className="ipt"
                placeholder="Song name"
                autoComplete="off"
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
                autoComplete="off"
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
              inputMode="url"
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
            ></textarea>
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
                <span className="switch" aria-hidden="true"></span>
                <span className="toggle-text" aria-live="polite">
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
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </section>

        {/* Right: MoodCardPreview —— 这里改成使用上面的 state */}
        <section className="card" aria-label="Preview · MoodCardPreview">
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
              {songName || "No song yet"}{" "}
              <small className="by">by {artist || "Artist"}</small>
            </p>

            <p className="meta">
              🔗{" "}
              <span className="link">{link || "Link"}</span> · 🏷️{" "}
              <span className="tag">{tag || "Tag"}</span>
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





