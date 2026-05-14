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
    <div className="rounded-[2rem] bg-white/90 border border-pink-100 shadow-xl p-5 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-pink-500 via-yellow-300 to-sky-400 flex items-center justify-center text-3xl shadow">
          🎵
        </div>

        <div>
          <h3 className="text-xl font-black text-[#211044]">
            Músicas Oficiais TeePoP
          </h3>
          <p className="text-sm font-bold text-purple-500">
            Escolha uma música da marca
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {songs.map((song) => (
          <button
            key={song.id}
            type="button"
            onClick={() => setSelectedSong(song)}
            className={`rounded-2xl px-4 py-3 text-left font-black transition ${
              selectedSong.id === song.id
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                : "bg-pink-50 text-[#211044] hover:bg-pink-100"
            }`}
          >
            <div>{song.title}</div>
            <div
              className={`text-xs ${
                selectedSong.id === song.id ? "text-white/80" : "text-purple-500"
              }`}
            >
              {song.language}
            </div>
          </button>
        ))}
      </div>

      <audio key={selectedSong.src} controls className="w-full">
        <source src={selectedSong.src} type="audio/mpeg" />
        Seu navegador não suporta áudio.
      </audio>
    </div>
  );
}