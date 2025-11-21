import { Routes, Route, Link } from "react-router-dom";
import Layout from "./component/Layout.jsx";
import Login from "./pages/Login.jsx";
import Settings from "./pages/Settings.jsx";
import "./styles/style.css";   
import "./index.css";        

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
