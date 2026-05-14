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
    <section className="overflow-hidden rounded-[2rem] bg-white/95 shadow-pop">
      <div className="h-2 bg-gradient-to-r from-pink-500 via-yellow-300 via-cyan-400 to-purple-500" />

      <div className="p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 via-yellow-300 to-sky-400 text-4xl shadow-lg">
              🎵
            </div>

            <div>
              <p className="badge-pop bg-pink-100 text-teepopPink">
                Música oficial da marca
              </p>

              <h2 className="mt-2 text-2xl font-black text-teepopInk">
                Músicas Oficiais TeePoP
              </h2>

              <p className="text-sm font-bold text-purple-500">
                Escolha uma música para tocar no painel.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-[420px]">
            {songs.map((song) => (
              <button
                key={song.id}
                type="button"
                onClick={() => setSelectedSong(song)}
                className={`rounded-3xl px-5 py-4 text-left transition ${
                  selectedSong.id === song.id
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                    : "bg-gradient-to-r from-pink-50 to-cyan-50 text-teepopInk hover:scale-[1.02]"
                }`}
              >
                <p className="text-base font-black">{song.title}</p>

                <p
                  className={`text-xs font-black ${
                    selectedSong.id === song.id
                      ? "text-white/80"
                      : "text-teepopPurple"
                  }`}
                >
                  {song.language}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-gradient-to-r from-pink-50 via-yellow-50 to-cyan-50 p-4">
          <p className="mb-3 text-sm font-black text-teepopPurple">
            Tocando agora: {selectedSong.title}
          </p>

          <audio key={selectedSong.src} controls className="w-full">
            <source src={selectedSong.src} type="audio/mpeg" />
            Seu navegador não suporta áudio.
          </audio>

          <p className="mt-3 text-xs font-bold text-purple-500">
            Os arquivos precisam estar em{" "}
            <span className="font-black">client/public/mp3</span>.
          </p>
        </div>
      </div>
    </section>
  );
}