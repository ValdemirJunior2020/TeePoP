// client/src/components/MusicPlayer.jsx

import { useState } from "react";

const songs = [
  {
    id: "pt",
    title: "🇧🇷 Abre a TeePoP",
    language: "Português",
    src: "/mp3/Abre a TeePoP.mp3",
  },
  {
    id: "en",
    title: "🇺🇸 Tampa Estourada",
    language: "English",
    src: "/mp3/Tampa Estourada (1).mp3",
  },
];

export default function MusicPlayer() {
  const [selectedSong, setSelectedSong] = useState(songs[0]);

  return (
    <div className="rounded-3xl bg-white/90 shadow-xl border border-pink-100 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 via-yellow-300 to-sky-400 flex items-center justify-center text-2xl shadow">
          🎵
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-800">
            Músicas Oficiais TeePoP
          </h3>
          <p className="text-sm text-slate-500">
            Escolha uma música oficial da marca
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {songs.map((song) => (
          <button
            key={song.id}
            type="button"
            onClick={() => setSelectedSong(song)}
            className={`rounded-2xl px-4 py-3 text-left font-bold transition ${
              selectedSong.id === song.id
                ? "bg-pink-500 text-white shadow-lg"
                : "bg-slate-100 text-slate-700 hover:bg-pink-100"
            }`}
          >
            <div>{song.title}</div>
            <div
              className={`text-xs ${
                selectedSong.id === song.id ? "text-white/80" : "text-slate-500"
              }`}
            >
              {song.language}
            </div>
          </button>
        ))}
      </div>

      <audio
        key={selectedSong.src}
        controls
        className="w-full"
      >
        <source src={selectedSong.src} type="audio/mpeg" />
        Seu navegador não suporta áudio.
      </audio>
    </div>
  );
}