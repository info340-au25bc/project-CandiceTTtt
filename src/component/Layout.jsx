import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const loc = useLocation();
  const isActive = (to) => (loc.pathname === to ? { "aria-current": "page" } : {});

  return (
    <div className="page-root">
      {/* 头部（沿用你原有 class 名） */}
      <header className="site-header">
        <div className="container header-flex">
          <h1 className="brand"><Link to="/">Mood Music</Link></h1>
          <nav className="site-nav" aria-label="Primary">
            <Link to="/" className="nav-pill" {...isActive("/")}>Home</Link>
            <Link to="/settings" className="nav-pill" {...isActive("/settings")}>Setting</Link>
            {/* 其它链接（占位） */}
            <a className="nav-pill" href="#" onClick={(e)=>e.preventDefault()}>Create Mood Card</a>
            <a className="nav-pill" href="#" onClick={(e)=>e.preventDefault()}>Public Wall</a>
            <a className="nav-pill" href="#" onClick={(e)=>e.preventDefault()}>My Journal</a>
          </nav>
        </div>
      </header>

      {/* 核心内容：这个 class 配合 CSS 让 footer 贴底 */}
      <main className="site-main">
        <Outlet />
      </main>

      {/* 页脚（保持你旧版样式类名） */}
      <footer className="site-footer">
        <div className="container">
          <p>© 2025 Mood Music · INFO 340</p>
          <nav className="site-nav" aria-label="Footer">
            <Link to="/" {...isActive("/")}>Home</Link>
            <a href="#" onClick={(e)=>e.preventDefault()}>Public Wall</a>
            <a href="#" onClick={(e)=>e.preventDefault()}>My Journal</a>
            <Link to="/settings" {...isActive("/settings")}>Setting</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
