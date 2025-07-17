"use client";

import { useState, useRef } from "react";
import { FaHome, FaSearch, FaBook, FaPlus, FaHeart, FaChevronLeft, FaChevronRight, FaChevronUp, FaChevronDown, FaEllipsisV, FaSun, FaMoon, FaStepForward, FaStepBackward, FaPlay, FaPause } from "react-icons/fa";
import Image from "next/image";
import { playlists as defaultPlaylists } from "@/data/playlists";

type Playlist = (typeof defaultPlaylists)[0];

type Song = {
  title: string;
  artist: string;
  image: string;
  audio: string;
};

type SidebarProps = {
  playlistsAction: Playlist[];
  setPlaylistsAction: React.Dispatch<React.SetStateAction<Playlist[]>>;
  onSelectPlaylistAction: (playlist: Playlist) => void;
  onGoHomeAction: () => void;
  allSongs: Song[];
  onSongSelectAction: (song: Song) => void;
  onSearchAction?: () => void;
  onLibraryAction?: () => void;
  onLikedSongsAction?: () => void;
};

export default function Sidebar({
  playlistsAction,
  setPlaylistsAction,
  onSelectPlaylistAction,
  onGoHomeAction,
  allSongs,
  onSongSelectAction,
  onSearchAction,
  onLibraryAction,
  onLikedSongsAction,
}: SidebarProps) {
  const [activeMenu, setActiveMenu] = useState("Ana Sayfa");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistImage, setNewPlaylistImage] = useState("/images/melodycat-logo.png");

  // Playlist görseli yükleme fonksiyonu
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewPlaylistImage(imageUrl);
    }
  };

  // Playlist oluşturma fonksiyonu
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

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(typeof window !== 'undefined' && window.document.body.classList.contains('dark') ? 'dark' : 'light');
  const [miniPlayerSong, setMiniPlayerSong] = useState<Song | null>(null);
  const [miniPlayerPlaying, setMiniPlayerPlaying] = useState(false);
  const [playlistMenuOpen, setPlaylistMenuOpen] = useState<number | null>(null);
  const [playlistRenameId, setPlaylistRenameId] = useState<number | null>(null);
  const [playlistRenameValue, setPlaylistRenameValue] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Tema toggle fonksiyonu
  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        window.document.body.classList.remove(prev);
        window.document.body.classList.add(next);
      }
      return next;
    });
  };

  // Playlist sıralama
  const movePlaylist = (from: number, to: number) => {
    if (to < 0 || to >= playlistsAction.length) return;
    setPlaylistsAction((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(from, 1);
      copy.splice(to, 0, removed);
      return copy;
    });
  };

  // Playlist silme
  const handleDeletePlaylist = (id: number) => {
    setPlaylistsAction((prev) => prev.filter((pl) => pl.id !== id));
  };

  // Playlist rename
  const handleRenamePlaylist = (id: number) => {
    setPlaylistsAction((prev) => prev.map((pl) => pl.id === id ? { ...pl, name: playlistRenameValue } : pl));
    setPlaylistRenameId(null);
    setPlaylistRenameValue("");
  };

  // Mini player kontrolleri
  const handleMiniPlay = () => setMiniPlayerPlaying((p) => !p);
  const handleMiniNext = () => {
    if (!miniPlayerSong) return;
    const idx = allSongs.findIndex((s) => s.audio === miniPlayerSong.audio);
    if (idx >= 0 && idx < allSongs.length - 1) setMiniPlayerSong(allSongs[idx + 1]);
  };
  const handleMiniPrev = () => {
    if (!miniPlayerSong) return;
    const idx = allSongs.findIndex((s) => s.audio === miniPlayerSong.audio);
    if (idx > 0) setMiniPlayerSong(allSongs[idx - 1]);
  };

  // Sidebar genişlik class
  const sidebarWidth = isCollapsed ? "w-20" : "w-60 sm:w-60";

  return (
    <aside className={`bg-black text-gray-300 ${sidebarWidth} h-screen fixed top-0 left-0 p-3 flex flex-col transition-all duration-300 z-40`}>
      {/* Collapse/Expand Button */}
      <button
        className="absolute -right-3 top-6 bg-orange-600 text-white rounded-full p-1 shadow hover:bg-orange-500 z-50"
        style={{ transform: isCollapsed ? 'rotate(180deg)' : undefined }}
        onClick={() => setIsCollapsed((c) => !c)}
        title={isCollapsed ? "Genişlet" : "Daralt"}
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 mb-8 transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}>
        <Image
          src="/images/melodycat-logo.png"
          alt="MelodyCat Logo"
          width={isCollapsed ? 32 : 40}
          height={isCollapsed ? 32 : 40}
          className="rounded-full"
        />
        {!isCollapsed && (
          <h1 className="text-white text-lg font-bold hidden sm:block">
            MelodyCat
          </h1>
        )}
      </div>

      {/* Menü */}
      <nav className="flex flex-col gap-2">
        {/* Menü Butonları */}
        {[
          { label: "Ana Sayfa", icon: <FaHome />, onClick: () => { setActiveMenu("Ana Sayfa"); onGoHomeAction(); } },
          { label: "Ara", icon: <FaSearch />, onClick: () => { setActiveMenu("Ara"); onSearchAction?.(); } },
          { label: "Kitaplık", icon: <FaBook />, onClick: () => { setActiveMenu("Kitaplık"); if (onLibraryAction) onLibraryAction(); } },
        ].map((item) => (
          <div key={item.label} className="relative">
            <button
              onClick={item.onClick}
              className={`group flex items-center gap-3 px-2 py-1 rounded-md transition w-full relative ${
                activeMenu === item.label
                  ? "bg-orange-600 text-white"
                  : "hover:bg-orange-500 hover:text-white"
              } ${isCollapsed ? 'justify-center' : ''}`}
              aria-label={item.label}
            >
              {/* Aktif menüde sol bar */}
              {activeMenu === item.label && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-r" />
              )}
              <span className="relative">
                {item.icon}
                {/* Tooltip */}
                {isCollapsed && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-gray-800 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-40 shadow">
                    {item.label}
                  </span>
                )}
              </span>
              {!isCollapsed && <span className="text-sm hidden sm:block">{item.label}</span>}
            </button>
          </div>
        ))}

        {/* Ara aktifse hemen altında arama kutusu ve sonuçlar */}
        {activeMenu === "Ara" && !isCollapsed && (
          <div className="mt-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Şarkı ara..."
              className="w-full p-2 rounded bg-neutral-900 text-white text-sm mb-2 border border-neutral-700 focus:outline-none focus:border-orange-500 transition"
              autoFocus
            />
            <div className="max-h-52 overflow-y-auto flex flex-col gap-2">
              {searchQuery.trim() === "" ? (
                <div className="text-xs text-gray-500 text-center">Aramak için yazmaya başla</div>
              ) : (
                allSongs
                  .filter((song: Song) =>
                    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((song: Song, idx: number) => (
                    <button
                      key={song.audio + idx}
                      onClick={() => onSongSelectAction(song)}
                      className="flex items-center gap-2 w-full text-left p-1 rounded hover:bg-orange-500 hover:text-white transition"
                    >
                      <Image src={song.image} alt={song.title} width={28} height={28} className="rounded" />
                      <div>
                        <div className="text-sm font-medium">{song.title}</div>
                        <div className="text-xs text-gray-400">{song.artist}</div>
                      </div>
                    </button>
                  ))
              )}
            </div>
          </div>
        )}
      </nav>

      <hr className="my-5 border-gray-700" />

      {/* Çalma Listesi Oluştur */}
      <div className="flex flex-col gap-5 mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-3 hover:bg-orange-500 hover:text-white px-2 py-1 rounded-md transition"
        >
          <FaPlus />
          <span className="text-sm hidden sm:block">Liste Oluştur</span>
        </button>
        <button
          className="flex items-center gap-3 hover:bg-orange-500 hover:text-white px-2 py-1 rounded-md transition"
          onClick={() => onLikedSongsAction && onLikedSongsAction()}
        >
          <FaHeart />
          <span className="text-sm hidden sm:block">Favoriler</span>
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

      {/* Playlistler - scrollable alan */}
      <div className="flex-1 overflow-y-auto pr-1">
        {playlistsAction.map((playlist, idx) => (
          <div key={playlist.id} className={`group flex items-center gap-2 px-1 py-1 rounded-md mb-1 relative hover:bg-orange-500 hover:text-white transition ${isCollapsed ? 'justify-center' : ''}`}
          >
            <button
              onClick={() => onSelectPlaylistAction(playlist)}
              className="flex items-center gap-2 flex-1 text-left"
              title={playlist.name}
            >
              <Image
                src={playlist.image}
                alt={playlist.name}
                width={isCollapsed ? 24 : 30}
                height={isCollapsed ? 24 : 30}
                className="rounded-sm"
              />
              {!isCollapsed && (
                playlistRenameId === playlist.id ? (
                  <input
                    className="bg-neutral-900 rounded px-1 text-xs w-28 mr-1"
                    value={playlistRenameValue}
                    autoFocus
                    onChange={e => setPlaylistRenameValue(e.target.value)}
                    onBlur={() => setPlaylistRenameId(null)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleRenamePlaylist(playlist.id);
                    }}
                  />
                ) : (
                  <span className="truncate w-32 text-sm">{playlist.name}</span>
                )
              )}
            </button>
            {/* Yukarı/Aşağı okları */}
            {!isCollapsed && (
              <div className="flex flex-col">
                <button
                  disabled={idx === 0}
                  onClick={() => movePlaylist(idx, idx - 1)}
                  className="text-xs text-gray-400 hover:text-white disabled:opacity-30"
                  tabIndex={-1}
                  title="Yukarı taşı"
                >
                  <FaChevronUp />
                </button>
                <button
                  disabled={idx === playlistsAction.length - 1}
                  onClick={() => movePlaylist(idx, idx + 1)}
                  className="text-xs text-gray-400 hover:text-white disabled:opacity-30"
                  tabIndex={-1}
                  title="Aşağı taşı"
                >
                  <FaChevronDown />
                </button>
              </div>
            )}
            {/* Sil/rename menüsü */}
            {!isCollapsed && (
              <div className="relative">
                <button
                  className="text-xs text-gray-400 hover:text-white p-1"
                  onClick={() => setPlaylistMenuOpen(playlistMenuOpen === playlist.id ? null : playlist.id)}
                  tabIndex={-1}
                  title="Daha fazla"
                >
                  <FaEllipsisV />
                </button>
                {playlistMenuOpen === playlist.id && (
                  <div className="absolute right-0 top-7 bg-neutral-900 border border-gray-700 rounded shadow z-50 py-1 w-32">
                    <button
                      className="block w-full text-left px-3 py-1 hover:bg-orange-500 text-xs"
                      onClick={() => {
                        setPlaylistRenameId(playlist.id);
                        setPlaylistRenameValue(playlist.name);
                        setPlaylistMenuOpen(null);
                      }}
                    >Yeniden Adlandır</button>
                    <button
                      className="block w-full text-left px-3 py-1 hover:bg-orange-500 text-xs text-red-400"
                      onClick={() => handleDeletePlaylist(playlist.id)}
                    >Sil</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mini Player ve Tema Toggle - sidebar altı */}
      <div className={`mt-3 pt-2 border-t border-gray-700 flex ${isCollapsed ? 'flex-col items-center' : 'flex-row items-center justify-between'} gap-3`}>
        {/* Mini Player */}
        {miniPlayerSong && (
          <div className={`flex items-center gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
            <Image
              src={miniPlayerSong.image}
              alt={miniPlayerSong.title}
              width={isCollapsed ? 24 : 32}
              height={isCollapsed ? 24 : 32}
              className="rounded"
            />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white truncate max-w-[80px]">{miniPlayerSong.title}</span>
                <span className="text-[10px] text-gray-400 truncate max-w-[80px]">{miniPlayerSong.artist}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <button onClick={handleMiniPrev} className="hover:text-orange-400" title="Önceki"><FaStepBackward /></button>
              <button onClick={handleMiniPlay} className="hover:text-orange-400" title={miniPlayerPlaying ? "Duraklat" : "Başlat"}>{miniPlayerPlaying ? <FaPause /> : <FaPlay />}</button>
              <button onClick={handleMiniNext} className="hover:text-orange-400" title="Sonraki"><FaStepForward /></button>
            </div>
          </div>
        )}
        {/* Tema Toggle */}
        <button
          className="ml-auto p-2 rounded-full bg-neutral-800 hover:bg-orange-500 transition text-white"
          onClick={handleToggleTheme}
          title={theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
        >
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </aside>
  );
}
