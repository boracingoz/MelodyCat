import React, { useState } from "react";
import Image from "next/image";

type Song = {
  title: string;
  artist: string;
  image: string;
  audio: string;
};

export default function SearchPage({
  onBack,
  allSongs,
  onSongSelectAction,
}: {
  onBack: () => void;
  allSongs: Song[];
  onSongSelectAction: (song: Song) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 bg-neutral-800 text-white rounded hover:bg-orange-600 transition"
      >
        ← Geri
      </button>
      <h2 className="text-2xl font-bold mb-4">Ara</h2>
      <input
        type="text"
        placeholder="Şarkı veya sanatçı ara..."
        className="w-full p-2 rounded bg-neutral-900 text-white text-sm mb-4 border border-neutral-700 focus:outline-none focus:border-orange-500 transition"
        autoFocus
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <div className="max-h-80 overflow-y-auto flex flex-col gap-2">
        {searchQuery.trim() === "" ? (
          <div className="text-xs text-gray-500 text-center">Aramak için yazmaya başla</div>
        ) : (
          allSongs
            .filter(song =>
              song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              song.artist.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 15)
            .map((song: Song, idx: number) => (
              <button
                key={song.audio + idx}
                onClick={() => onSongSelectAction(song)}
                className="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-orange-500 hover:text-white transition"
              >
                <Image src={song.image} alt={song.title} width={36} height={36} className="rounded" />
                <div>
                  <div className="text-sm font-medium">{song.title}</div>
                  <div className="text-xs text-gray-400">{song.artist}</div>
                </div>
              </button>
            ))
        )}
      </div>
    </div>
  );
}
