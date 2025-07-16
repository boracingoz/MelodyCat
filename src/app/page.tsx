"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/SideBar";
import PlayerBar from "@/components/PlayerBar";
import Image from "next/image";

type Song = {
  title: string;
  artist: string;
  image: string;
  audio: string;
};

type Playlist = {
  id: number;
  name: string;
  image: string;
  songs: Song[];
};

export default function Home() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // ✅ Şarkı listesi doğrudan public klasöründen
  const allSongs: Song[] = [
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      image: "/images/blinding-lights.jpg",
      audio: "/music/blinding-lights.mp3",
    },
    {
      title: "Save Your Tears",
      artist: "The Weeknd",
      image: "/images/save-your-tears.jpg",
      audio: "/music/save-your-tears.mp3",
    },
    {
      title: "Starboy",
      artist: "The Weeknd",
      image: "/images/starboy.jpg",
      audio: "/music/starboy.mp3",
    },
  ];

  // ✅ LocalStorage'dan playlistleri yükle
  useEffect(() => {
    const stored = localStorage.getItem("melodycat_playlists");
    if (stored) {
      setPlaylists(JSON.parse(stored));
    }
  }, []);

  // ✅ LocalStorage'a her değişiklikte kaydet
  useEffect(() => {
    localStorage.setItem("melodycat_playlists", JSON.stringify(playlists));
  }, [playlists]);

  // ✅ Şarkı ekleme
  const handleAddSongToPlaylist = (song: Song) => {
    if (!selectedPlaylist) return;

    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === selectedPlaylist.id
          ? {
              ...pl,
              songs: pl.songs.some((s) => s.audio === song.audio)
                ? pl.songs
                : [...pl.songs, song],
            }
          : pl
      )
    );

    setSelectedPlaylist((prev) =>
      prev
        ? {
            ...prev,
            songs: prev.songs.some((s) => s.audio === song.audio)
              ? prev.songs
              : [...prev.songs, song],
          }
        : prev
    );
  };

  // ✅ Şarkı silme
  const handleRemoveSongFromPlaylist = (index: number) => {
    if (!selectedPlaylist) return;

    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === selectedPlaylist.id
          ? { ...pl, songs: pl.songs.filter((_, i) => i !== index) }
          : pl
      )
    );

    setSelectedPlaylist((prev) =>
      prev ? { ...prev, songs: prev.songs.filter((_, i) => i !== index) } : prev
    );
  };

  return (
    <main className="bg-dark text-white min-h-screen flex">
      <Sidebar
        playlistsAction={playlists}
        setPlaylistsAction={setPlaylists}
        onSelectPlaylistAction={(playlist) => setSelectedPlaylist(playlist)}
        onGoHomeAction={() => setSelectedPlaylist(null)}
      />

      <div className="ml-60 flex-1 p-8">
        {!selectedPlaylist ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Image
              src="/images/melodycat-logo.png"
              alt="MelodyCat Logo"
              width={80}
              height={80}
              className="rounded-full mb-4"
            />
            <h1 className="text-primary text-4xl font-bold">
              🎵 MelodyCat Çalışıyor!
            </h1>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedPlaylist.name}</h2>

            {/* ✅ Playlist Şarkıları */}
            <div className="flex flex-col gap-4 mb-6">
              {selectedPlaylist.songs.map((song, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-2 rounded bg-neutral-800"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setCurrentSong(song)}
                  >
                    <Image
                      src={song.image}
                      alt={song.title}
                      width={48}
                      height={48}
                      className="rounded"
                    />
                    <div>
                      <p className="font-semibold">{song.title}</p>
                      <p className="text-xs text-gray-400">{song.artist}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSongFromPlaylist(index)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Kaldır
                  </button>
                </div>
              ))}
            </div>

            {/* ✅ Tüm Şarkılardan Playlist'e Ekleme */}
            <h3 className="text-lg font-semibold mb-2">Tüm Şarkılar</h3>
            <div className="grid grid-cols-2 gap-3">
              {allSongs.map((song, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-neutral-900"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={song.image}
                      alt={song.title}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <div>
                      <p className="font-semibold">{song.title}</p>
                      <p className="text-xs text-gray-400">{song.artist}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddSongToPlaylist(song)}
                    className="bg-orange-600 text-black px-2 py-1 text-xs rounded hover:bg-orange-500"
                  >
                    Ekle
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <PlayerBar currentSong={currentSong} />
    </main>
  );
}
