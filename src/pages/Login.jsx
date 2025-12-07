import { useState } from "react";
import { getDatabase, ref, get, set as firebaseSet } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    const db = getDatabase();
    const userRef = ref(db, "users/" + trimmedUser);

    try {
      const snapshot = await get(userRef);

      /* ============================
         LOGIN
      ============================ */
      if (mode === "login") {
        if (!snapshot.exists()) {
          setError("User does not exist.");
          return;
        }

        const userData = snapshot.val();
        if (userData.password !== trimmedPass) {
          setError("Incorrect password.");
          return;
        }

        const userInfo = { username: trimmedUser };

        // ⭐ MOST IMPORTANT: Save to localStorage
        localStorage.setItem("currentUser", JSON.stringify(userInfo));

        onLogin?.(userInfo);
        navigate("/create-mood");
      }

      /* ============================
         SIGNUP
      ============================ */
      else {
        if (snapshot.exists()) {
          setError("Username is already taken.");
          return;
        }

        // Create new user in Firebase
        await firebaseSet(userRef, {
          password: trimmedPass,
          createdAt: Date.now(),
          moods: {} // ⭐ include moods folder (optional but clean)
        });

        const userInfo = { username: trimmedUser };

        // ⭐ NEW FIX: Save new user immediately to localStorage
        localStorage.setItem("currentUser", JSON.stringify(userInfo));

        onLogin?.(userInfo);
        navigate("/create-mood");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError("");
    setPassword("");
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  const isLogin = mode === "login";

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <h2 className="auth-title">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <p className="auth-sub">
          {isLogin
            ? "Login to access your playlists and mood journals"
            : "Sign up to save your moods and playlists"}
        </p>

        <section className="auth-card" aria-labelledby="loginTitle">
          <h3 id="loginTitle" className="visually-hidden">
            {isLogin ? "Login Form" : "Signup Form"}
          </h3>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username" className="lbl">Username</label>
              <input
                id="username"
                className="ipt"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="password" className="lbl">Password</label>
              <input
                id="password"
                className="ipt"
                type="password"
                placeholder="Enter your password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="auth-error" style={{ color: "red" }}>{error}</p>}

            <div className="auth-actions">
              <button className="auth-btn" type="submit" disabled={loading}>
                {loading
                  ? isLogin
                    ? "Logging in..."
                    : "Signing up..."
                  : isLogin
                  ? "Login"
                  : "Sign Up"}
              </button>
            </div>

            <p className="auth-meta">
              {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
              <button type="button" className="auth-switch-btn" onClick={toggleMode}>
                {isLogin ? "Sign up" : "Back to login"}
              </button>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

