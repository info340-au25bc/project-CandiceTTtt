import { Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Settings from "./pages/Settings.jsx";
import Playlist from "./pages/Playlist.jsx";
import CreateMoodPage from "./pages/CreateMood.jsx";
import "./styles/style.css";   
import "./index.css";        

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route path="/playlists" element={<Playlist />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/create-mood" element={<CreateMoodPage />} />
      </Route>
    </Routes>
  );
}
