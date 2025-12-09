import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB9TM2sU2CPpByud6OS3hlRU1o4o-w74pw",
  authDomain: "mood-music-6e5d5.firebaseapp.com",
  databaseURL: "https://mood-music-6e5d5-default-rtdb.firebaseio.com",
  projectId: "mood-music-6e5d5",
  storageBucket: "mood-music-6e5d5.firebasestorage.app",
  messagingSenderId: "1000549241184",
  appId: "1:1000549241184:web:206365229618a4f00a0e05",
  measurementId: "G-R5N2BGG9VM"

};

initializeApp(firebaseConfig);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


