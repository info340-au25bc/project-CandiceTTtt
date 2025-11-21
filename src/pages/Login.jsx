export default function Login() {
    return (
      <div className="auth-page">
        <div className="auth-wrap">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-sub">Login to access your playlists and mood journals</p>
  
          <section className="auth-card" aria-labelledby="loginTitle">
            <h3 id="loginTitle" className="visually-hidden">Login Form</h3>
  
            <form className="auth-form" onSubmit={(e)=>e.preventDefault()}>
              <div className="field">
                <label htmlFor="username" className="lbl">Username</label>
                <input id="username" className="ipt" type="text" placeholder="Enter your username" autoComplete="username" />
              </div>
  
              <div className="field">
                <label htmlFor="password" className="lbl">Password</label>
                <input id="password" className="ipt" type="password" placeholder="Enter your password" autoComplete="current-password" />
              </div>
  
              <div className="auth-actions">
                <button className="auth-btn" type="submit">Login</button>
              </div>
  
              <p className="auth-meta">
                Don’t have an account? <a href="#" onClick={(e)=>e.preventDefault()}>Sign up</a>
              </p>
            </form>
          </section>
        </div>
      </div>
    );
  }
  