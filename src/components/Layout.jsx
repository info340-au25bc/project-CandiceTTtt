import React, { useState, useEffect } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "../pages/Login.jsx";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username) {
          setCurrentUser(parsed);
        }
      } catch (e) {
        console.error("Failed to parse currentUser", e);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser && location.pathname === "/") {
      navigate("/create-mood", { replace: true });
    }
  }, [currentUser, location.pathname, navigate]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/", { replace: true });
  };

  const handleLogin = (userInfo) => {
    const normalized =
      typeof userInfo === "string" ? { username: userInfo } : userInfo;

    setCurrentUser(normalized);
    localStorage.setItem("currentUser", JSON.stringify(normalized));
    navigate("/create-mood", { replace: true }); // 登录后去 Create Mood
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="page-root">
      <header className="site-header">
        <div className="container header-flex">
          <h1 className="brand">
            <NavLink to="/create-mood" end onClick={closeMenu}>
              Mood Music
            </NavLink>
          </h1>

          <nav className="site-nav" aria-label="Primary">
            <button
              type="button"
              className="nav-toggle"
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isOpen ? "true" : "false"}
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className={`nav-menu ${isOpen ? "is-open" : ""}`}>
              <NavLink to="/create-mood" onClick={closeMenu}>
                Create Mood Card
              </NavLink>
              <NavLink to="/wall" onClick={closeMenu}>
                Public Wall
              </NavLink>
              <NavLink to="/playlists" onClick={closeMenu}>
                My Playlists
              </NavLink>
              <NavLink to="/settings" onClick={closeMenu}>
                Setting
              </NavLink>

              <span className="nav-user">
                <span className="nav-username">{currentUser.username}</span>
                <button
                  type="button"
                  className="nav-pill nav-logout"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </span>
            </div>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet context={{ currentUser, handleLogout }} />
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© 2025 Mood Music · INFO 340</p>

          <nav className="site-nav" aria-label="Footer">
            <div className="site-nav-row">
              <NavLink to="/create-mood">Create Mood Card</NavLink>
              <NavLink to="/wall">Public Wall</NavLink>
            </div>

            <div className="site-nav-row">
              <NavLink to="/playlists">My Playlists</NavLink>
              <NavLink to="/settings">Setting</NavLink>
            </div>
          </nav>
        </div>
      </footer>
    </div>
  );
}