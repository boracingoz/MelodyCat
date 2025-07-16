"use client";

import { useState, useRef } from "react";
import { FaHome, FaSearch, FaBook, FaPlus, FaHeart } from "react-icons/fa";
import Image from "next/image";
import { playlists as defaultPlaylists } from "@/data/playlists";

type Playlist = (typeof defaultPlaylists)[0];

type SidebarProps = {
  playlistsAction: Playlist[];
  setPlaylistsAction: React.Dispatch<React.SetStateAction<Playlist[]>>;
  onSelectPlaylistAction: (playlist: Playlist) => void;
  onGoHomeAction: () => void;
};

export default function Sidebar({
  playlistsAction,
  setPlaylistsAction,
  onSelectPlaylistAction,
  onGoHomeAction,
}: SidebarProps) {
  const [activeMenu, setActiveMenu] = useState("Ana Sayfa");
  const [showForm, setShowForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistImage, setNewPlaylistImage] = useState(
    "/images/melodycat-logo.png"
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewPlaylistImage(imageUrl);
    }
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist: Playlist = {
      id: Date.now(),
      name: newPlaylistName,
      image: newPlaylistImage,
      songs: [],
    };
    setPlaylistsAction((prev) => [...prev, newPlaylist]);
    setShowForm(false);
    setNewPlaylistName("");
    setNewPlaylistImage("/images/melodycat-logo.png");
  };

  return (
    <aside className="bg-black text-gray-300 w-60 sm:w-60 h-screen fixed top-0 left-0 p-5 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/images/melodycat-logo.png"
          alt="MelodyCat Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="text-white text-lg font-bold hidden sm:block">
          MelodyCat
        </h1>
      </div>

      {/* Menü */}
      <nav className="flex flex-col gap-5">
        {[
          { name: "Ana Sayfa", icon: <FaHome />, action: onGoHomeAction },
          { name: "Ara", icon: <FaSearch />, action: () => {} },
          { name: "Kitaplık", icon: <FaBook />, action: () => {} },
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setActiveMenu(item.name);
              item.action();
            }}
            className={`flex items-center gap-3 px-2 py-1 rounded-md transition ${
              activeMenu === item.name
                ? "bg-orange-600 text-white"
                : "hover:bg-orange-500 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="text-sm hidden sm:block">{item.name}</span>
          </button>
        ))}
      </nav>

      <hr className="my-5 border-gray-700" />

      {/* Çalma Listesi Oluştur */}
      <div className="flex flex-col gap-5 mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-3 hover:bg-orange-500 hover:text-white px-2 py-1 rounded-md transition"
        >
          <FaPlus />
          <span className="text-sm hidden sm:block">Çalma Listesi Oluştur</span>
        </button>
        <button className="flex items-center gap-3 hover:bg-orange-500 hover:text-white px-2 py-1 rounded-md transition">
          <FaHeart />
          <span className="text-sm hidden sm:block">Beğenilen Şarkılar</span>
        </button>
      </div>

      {showForm && (
        <div className="mb-4 bg-neutral-800 p-3 rounded-md">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
            placeholder="Playlist adı"
            className="w-full p-1 rounded bg-neutral-900 text-white text-sm mb-2"
          />
          <div
            className="mb-2 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image
              src={newPlaylistImage}
              alt="Yeni Playlist Görseli"
              width={50}
              height={50}
              className="rounded hover:opacity-80 transition"
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={handleCreatePlaylist}
            className="w-full bg-orange-600 text-black text-sm rounded py-1"
          >
            Kaydet
          </button>
        </div>
      )}

      <hr className="my-3 border-gray-700" />

      {/* Playlistler */}
      <div className="flex-1 overflow-y-auto">
        {playlistsAction.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => onSelectPlaylistAction(playlist)}
            className="w-full text-left px-2 py-1 rounded-md text-gray-300 hover:bg-orange-500 hover:text-white transition text-sm flex items-center gap-2"
          >
            <Image
              src={playlist.image}
              alt={playlist.name}
              width={30}
              height={30}
              className="rounded-sm"
            />
            <span className="hidden sm:block">{playlist.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
