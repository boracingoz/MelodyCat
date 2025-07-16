"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
  FaVolumeMute,
  FaRandom,
  FaRedo,
  FaHeart,
} from "react-icons/fa";

// ✅ Props Tipi
type Song = {
  title: string;
  artist: string;
  image: string;
  audio: string;
};

type PlayerBarProps = {
  currentSong: Song | null;
};

export default function PlayerBar({ currentSong }: PlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ✅ Şarkı değiştiğinde PlayerBar'ı güncelle
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audio;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isLoop) {
        audio.currentTime = 0;
        audio.play();
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [volume, isLoop]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setProgress(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = Number(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-3 py-3">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Şarkı Bilgisi */}
        {currentSong ? (
          <div className="flex items-center gap-3 min-w-[150px]">
            <Image
              src={currentSong.image}
              alt={currentSong.title}
              width={48}
              height={48}
              className="rounded-md"
            />
            <div>
              <p className="text-white text-sm font-semibold truncate max-w-[150px]">
                {currentSong.title}
              </p>
              <p className="text-gray-400 text-xs truncate max-w-[150px]">
                {currentSong.artist}
              </p>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`ml-2 transition-transform ${
                isLiked
                  ? "text-primary scale-110"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FaHeart size={16} />
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Şarkı seçin</p>
        )}

        {/* Kontroller */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`transition-transform hover:scale-110 ${
              isShuffle ? "text-primary" : "text-gray-300 hover:text-white"
            }`}
          >
            <FaRandom size={16} />
          </button>
          <button
            onClick={() => audioRef.current && (audioRef.current.currentTime = 0)}
            className="text-gray-300 hover:text-white transition-transform hover:scale-110"
          >
            <FaStepBackward size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform"
          >
            {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
          </button>
          <button
            className="text-gray-300 hover:text-white transition-transform hover:scale-110"
            disabled
          >
            <FaStepForward size={18} />
          </button>
          <button
            onClick={() => setIsLoop(!isLoop)}
            className={`transition-transform hover:scale-110 ${
              isLoop ? "text-primary" : "text-gray-300 hover:text-white"
            }`}
          >
            <FaRedo size={16} />
          </button>
        </div>

        {/* Ses Kontrolü */}
        <div className="flex items-center gap-2 w-28 sm:w-32">
          {volume > 0 ? (
            <FaVolumeUp className="text-gray-300" />
          ) : (
            <FaVolumeMute className="text-gray-300" />
          )}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-gray-400 text-xs">{formatTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="w-full accent-primary"
        />
        <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
}
