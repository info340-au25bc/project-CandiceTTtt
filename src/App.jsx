import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Settings from "./pages/Settings.jsx";
import Playlist from "./pages/Playlist.jsx";
import PlaylistDetail from "./pages/PlaylistDetail.jsx";
import CreateMoodPage from "./pages/CreateMood.jsx";
import Wall from "./pages/Wall.jsx";
import "./styles/style.css";
import "./index.css";

function NotFoundPage() {
  const navigate = useNavigate(); 

  return (
    <main className="container">
      <section className="page-head">
        <h2>Page not found</h2>
        <p className="subtitle">
          The page you're looking for doesn't exist. Use the navigation above to explore Mood Music 🎧
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/create-mood")}
        >
          Go to Create Mood Page
        </button>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CreateMoodPage />} />
        <Route path="create-mood" element={<CreateMoodPage />} />
        <Route path="wall" element={<Wall />} />
        <Route path="playlists" element={<Playlist />} />
        <Route path="playlists/:moodId" element={<PlaylistDetail />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFoundPage />} /> 
      </Route>
    </Routes>
  );
}

