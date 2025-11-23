import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="page-root">
      <header className="site-header">
        <div className="container header-flex">
          <h1 className="brand">
            <NavLink to="/" end onClick={closeMenu}>
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
              <NavLink
                to="/"
                end
                onClick={closeMenu}
              >
                Home
              </NavLink>

              <NavLink
                to="/create-mood"
                onClick={closeMenu}
              >
                Create Mood Card
              </NavLink>

              <NavLink
                to="/wall"
                onClick={closeMenu}
              >
                Public Wall
              </NavLink>

              <NavLink
                to="/playlists"
                onClick={closeMenu}
              >
                My Playlists
              </NavLink>

              <NavLink
                to="/settings"
                onClick={closeMenu}
              >
                Setting
              </NavLink>
            </div>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© 2025 Mood Music · INFO 340</p>

          <nav className="site-nav" aria-label="Footer">
            <div className="site-nav-row">
              <NavLink to="/" end>Home</NavLink>
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
