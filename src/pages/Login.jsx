import { useState } from "react";
import {
  getDatabase,
  ref,
  get,
  set as firebaseSet,
} from "firebase/database";
import { useNavigate, Navigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    return <Navigate to="/create-mood" replace />;
  }

  async function handleSubmit(e) {
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

        if (onLogin) {
          onLogin(userInfo);
        } else {
          localStorage.setItem("currentUser", JSON.stringify(userInfo));
          navigate("/create-mood", { replace: true });
        }
      } else {
        if (snapshot.exists()) {
          setError("Username is already taken.");
          return;
        }

        await firebaseSet(userRef, {
          password: trimmedPass,
          createdAt: Date.now(),
        });

        const userInfo = { username: trimmedUser };

        if (onLogin) {
          onLogin(userInfo);
        } else {
          localStorage.setItem("currentUser", JSON.stringify(userInfo));
          navigate("/create-mood", { replace: true });
        }
      }
    } catch (err) {
      console.error("Login/Signup error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setError("");
    setPassword("");
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  }

  const isLogin = mode === "login";

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <h2 className="auth-title">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <p className="auth-sub">
          {isLogin
            ? "Login to access your playlists and mood journals."
            : "Sign up to save your moods and playlists."}
        </p>

        <section className="auth-card" aria-labelledby="loginTitle">
          <h3 id="loginTitle" className="visually-hidden">
            {isLogin ? "Login Form" : "Signup Form"}
          </h3>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username" className="lbl">
                Username
              </label>
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
              <label htmlFor="password" className="lbl">
                Password
              </label>
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

            <div
              aria-live="polite"
              className="auth-error-region"
            >
              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="auth-actions">
              <button
                className="auth-btn"
                type="submit"
                disabled={loading}
              >
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
              {isLogin
                ? "Don’t have an account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={toggleMode}
              >
                {isLogin ? "Sign up" : "Back to login"}
              </button>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
