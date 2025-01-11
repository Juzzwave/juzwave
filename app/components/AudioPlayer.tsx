'use client';

import { useState, useRef, useEffect } from 'react';
import { Track } from '../types';

interface AudioPlayerProps {
  track: Track;
}

export default function AudioPlayer({ track }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(error => {
        console.log('Autoplay prevented:', error);
        setIsPlaying(false);
      });
    }
  }, [track.id, volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4">
      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <button
        onClick={togglePlay}
        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:shadow-glow"
      >
        {isPlaying ? (
          <span className="material-icons text-2xl">pause</span>
        ) : (
          <span className="material-icons text-2xl">play_arrow</span>
        )}
      </button>
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div 
          ref={progressRef}
          className="h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{
              width: `${(currentTime / duration) * 100}%`,
            }}
          />
        </div>
      </div>
      <div className="relative">
        <button
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
        >
          <span className="material-icons text-gray-400">
            {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
          </span>
        </button>
        {showVolumeSlider && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-secondary border border-gray-800 rounded-lg shadow-xl">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
} 