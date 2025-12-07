import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Settings from "./pages/Settings.jsx";
import Playlist from "./pages/Playlist.jsx";
import PlaylistDetail from "./pages/PlaylistDetail.jsx";
import CreateMoodPage from "./pages/CreateMood.jsx";
import Wall from "./pages/Wall.jsx";
import "./styles/style.css";
import "./index.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/playlists" element={<Playlist />} />
        <Route path="/playlists/:moodId" element={<PlaylistDetail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/create-mood" element={<CreateMoodPage />} />
        <Route path="/wall" element={<Wall />} />
      </Route>
    </Routes>
  );
}
