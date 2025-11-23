import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="page-root">
      {/* Header */}
      <header className="site-header">
        <div className="container header-flex">
          <h1 className="brand">
            <NavLink to="/" end>
              Mood Music
            </NavLink>
          </h1>

          <nav className="site-nav" aria-label="Primary">

            {/* 1. Home */}
            <NavLink
              to="/"
              end
              className="nav-pill"
            >
              Home
            </NavLink>

            {/* 2. Create Mood Card */}
            <NavLink
              to="/create-mood"
              className="nav-pill"
            >
              Create Mood Card
            </NavLink>

            {/* 3. Public Wall */}
            <NavLink
              to="/wall"
              className="nav-pill"
            >
              Public Wall
            </NavLink>

            {/* 4. My Playlists */}
            <NavLink
              to="/playlists"
              className="nav-pill"
            >
              My Playlists
            </NavLink>

            {/* 5. Setting */}
            <NavLink
              to="/settings"
              className="nav-pill"
            >
              Setting
            </NavLink>

          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="site-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <p>© 2025 Mood Music · INFO 340</p>
          <nav className="site-nav" aria-label="Footer">

            {/* Footer 顺序与 Header 一致 */}
            <NavLink to="/" end>
              Home
            </NavLink>

            <NavLink to="/create-mood">
              Create Mood Card
            </NavLink>

            <NavLink to="/wall">
              Public Wall
            </NavLink>

            <NavLink to="/playlists">
              My Playlists
            </NavLink>

            <NavLink to="/settings">
              Setting
            </NavLink>

          </nav>
        </div>
      </footer>
    </div>
  );
}
