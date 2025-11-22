import React from "react";

export default function CreateMoodPage() {
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
              <label className="emoji">
                <input
                  type="radio"
                  name="mood"
                  className="emoji-radio"
                  defaultChecked
                />
                <img src="/shared_imgs/happy.PNG" alt="Happy" />
              </label>

              <label className="emoji">
                <input type="radio" name="mood" className="emoji-radio" />
                <img src="/shared_imgs/angry.PNG" alt="Angry" />
              </label>

              <label className="emoji">
                <input type="radio" name="mood" className="emoji-radio" />
                <img src="/shared_imgs/calm.PNG" alt="Calm" />
              </label>

              <label className="emoji">
                <input type="radio" name="mood" className="emoji-radio" />
                <img src="/shared_imgs/confused.PNG" alt="Confused" />
              </label>

              <label className="emoji">
                <input type="radio" name="mood" className="emoji-radio" />
                <img src="/shared_imgs/excited.PNG" alt="Excited" />
              </label>

              <label className="emoji">
                <input type="radio" name="mood" className="emoji-radio" />
                <img src="/shared_imgs/exhausted.PNG" alt="Exhausted" />
              </label>

              <label className="emoji">
                <input type="radio" name="mood" className="emoji-radio" />
                <img src="/shared_imgs/lovely.PNG" alt="Lovely" />
              </label>

              <label className="emoji">
                <input type="radio" name="mood" className="emoji-radio" />
                <img src="/shared_imgs/relaxed.PNG" alt="Relaxed" />
              </label>

              <label className="emoji">
                <input type="radio" name="mood" className="emoji-radio" />
                <img src="/shared_imgs/sad.PNG" alt="Sad" />
              </label>

              <label className="emoji">
                <input type="radio" name="mood" className="emoji-radio" />
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
              />
            </label>

            <label className="field">
              <span className="lbl">Artist</span>
              <input
                type="text"
                className="ipt"
                placeholder="Artist"
                autoComplete="off"
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
            />
          </label>

          <label className="field">
            <span className="lbl">Short Diary (optional)</span>
            <textarea
              className="ipt textarea"
              placeholder="Write a little note…"
            ></textarea>
          </label>

          <div className="row">
            <div className="field">
              <span className="lbl">Public / Private</span>

              <label className="toggle">
                <input
                  type="checkbox"
                  className="toggle-ck"
                  defaultChecked
                />
                <span className="switch" aria-hidden="true"></span>
                <span className="toggle-text" aria-live="polite">
                  Public
                </span>
              </label>
            </div>

            <label className="field">
              <span className="lbl">Tag (optional)</span>
              <select className="ipt select" defaultValue="">
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
              aria-disabled="true"
            >
              Save
            </button>
            <button className="btn btn-ghost" type="reset">
              Clear
            </button>
          </div>
        </section>

        {/* Right: MoodCardPreview (static) */}
        <section className="card" aria-label="Preview · MoodCardPreview">
          <div className="card-head">
            <h2>
              Preview <span className="badge">MoodCardPreview</span>
            </h2>
          </div>

          <div className="mood-card">
            <div className="mood-head">
              <div className="mood-emoji">
                <img src="/shared_imgs/happy.PNG" alt="Preview emoji" />
              </div>
              <span className="pill">Public</span>
            </div>

            <p className="song">
              No song yet <small className="by">by Artist</small>
            </p>
            <p className="meta">
              🔗 <span className="link">Link</span> · 🏷️{" "}
              <span className="tag">Tag</span>
            </p>
            <div className="diary">
              Write a little diary. It will show here.
            </div>
          </div>

          <footer className="footer-actions">
            <button className="btn btn-ghost" type="button" disabled>
              Add Song to New Playlist
            </button>
            <button className="btn btn-outline" type="button">
              Go to Playlist Builder
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}


