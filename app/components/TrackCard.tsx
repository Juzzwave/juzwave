'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Track } from '../types';
import AudioPlayer from './AudioPlayer';

interface TrackCardProps {
  track: Track;
  onPlay: () => void;
  onDelete: () => void;
}

export default function TrackCard({ track, onPlay, onDelete }: TrackCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-secondary/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all">
      <div className="relative aspect-square">
        <Image
          src={track.coverImage}
          alt={track.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            className="w-16 h-16 bg-primary rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:shadow-glow"
            onClick={onPlay}
          >
            <span className="material-icons text-4xl">play_arrow</span>
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{track.title}</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-icons text-gray-400">headphones</span>
            <span className="text-gray-400">{track.plays}</span>
            <span className="material-icons text-gray-400 ml-2">favorite</span>
            <span className="text-gray-400">{track.likes}</span>
          </div>
          <span className="text-primary font-medium">${track.price}</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg">
            Buy Now
          </button>
          <div className="relative">
            <button 
              className="p-2 border border-gray-600 rounded-lg hover:bg-gray-800"
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="material-icons">more_vert</span>
            </button>
            {showMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-secondary border border-gray-800 rounded-lg shadow-xl">
                <button 
                  className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center gap-2 text-red-500"
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                >
                  <span className="material-icons text-sm">delete</span>
                  Delete Track
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 