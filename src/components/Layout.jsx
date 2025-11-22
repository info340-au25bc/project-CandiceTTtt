
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
            <NavLink
              to="/"
              end
              className="nav-pill"
            >
              Home
            </NavLink>

            <NavLink
              to="/settings"
              className="nav-pill"
            >
              Setting
            </NavLink>

            <NavLink
              to="/playlists"
              className="nav-pill"
            >
              My Playlists
            </NavLink>

            
            <NavLink
              to="/create-mood"
              className="nav-pill"
            >
              Create Mood Card
            </NavLink>

            
            <NavLink
              to="/wall"
              className="nav-pill"
            >
              Public Wall
            </NavLink>
          </nav>
        </div>
      </header>

     
      <main className="site-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <p>© 2025 Mood Music · INFO 340</p>
          <nav className="site-nav" aria-label="Footer">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/create-mood">
              Create Mood Card
            </NavLink>
            <NavLink to="/wall">
              Public Wall
            </NavLink>
            <NavLink to="/journal">
              My Journal
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

