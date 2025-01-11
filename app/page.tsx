'use client';

import { useState } from 'react';
import TrackCard from './components/TrackCard';
import AudioPlayer from './components/AudioPlayer';
import { Track } from './types';
import Image from 'next/image';
import UploadModal from './components/UploadModal';

const INITIAL_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    description: 'Chill summer beat perfect for your next track',
    coverImage: '/images/summer-vibes.jpg',
    audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
    price: 29.99,
    type: 'beat',
    tags: ['summer', 'chill', 'hip-hop'],
    createdAt: new Date(),
    userId: '1',
    plays: 1200,
    likes: 340
  },
  {
    id: '2',
    title: 'Night Drive',
    description: 'Deep house vibes for late night drives',
    coverImage: '/images/night-drive.jpg',
    audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav',
    price: 34.99,
    type: 'beat',
    tags: ['house', 'electronic', 'night'],
    createdAt: new Date(),
    userId: '1',
    plays: 800,
    likes: 220
  }
];

export default function Home() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  const handleUploadTrack = (newTrack: Track) => {
    setTracks(prevTracks => [newTrack, ...prevTracks]);
  };

  const handleDeleteTrack = (trackId: string) => {
    setTracks(prevTracks => prevTracks.filter(track => track.id !== trackId));
    if (currentTrack?.id === trackId) {
      setCurrentTrack(null);
    }
  };

  // Фильтрация треков
  const filteredTracks = tracks.filter(track => {
    if (filter === 'all') return true;
    return track.type === filter;
  });

  // Сортировка треков
  const sortedTracks = [...filteredTracks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'popular':
        return b.plays - a.plays;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen pb-24">
      <div className="main-background" />
      {/* Header */}
      <header className="bg-secondary/80 backdrop-blur-sm py-4 sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="material-icons text-primary text-3xl">album</span>
              <span className="text-2xl font-bold text-white">DJuzzwave</span>
            </div>

            {/* Upload Button */}
            <button 
              className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full transition-colors flex items-center gap-2"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <span className="material-icons">add</span>
              Upload Beat
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                className={`px-4 py-2 rounded-full transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'}`} 
                onClick={() => setFilter('all')}
              >
                All Beats
              </button>
              <button 
                className={`px-4 py-2 rounded-full transition-colors ${filter === 'beats' ? 'bg-primary text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'}`} 
                onClick={() => setFilter('beats')}
              >
                Featured
              </button>
              <button 
                className={`px-4 py-2 rounded-full transition-colors ${filter === 'tracks' ? 'bg-primary text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'}`} 
                onClick={() => setFilter('tracks')}
              >
                New Releases
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select 
                className="bg-gray-800/50 px-4 py-2 rounded-full text-sm border-none outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTracks.map((track) => (
            <TrackCard 
              key={track.id} 
              track={track} 
              onPlay={() => handlePlayTrack(track)}
              onDelete={() => handleDeleteTrack(track.id)}
            />
          ))}
        </div>
      </main>

      {/* Footer Player */}
      <footer className="fixed bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-sm border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 min-w-[200px]">
              <div className="w-12 h-12 relative bg-gray-800 rounded">
                {currentTrack ? (
                  <Image
                    src={currentTrack.coverImage}
                    alt={currentTrack.title}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-icons text-gray-600">music_note</span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium truncate">
                  {currentTrack ? currentTrack.title : 'No track selected'}
                </h4>
                <p className="text-sm text-gray-400">
                  {currentTrack ? currentTrack.type : 'Select a track to play'}
                </p>
              </div>
            </div>
            <div className="flex-1 max-w-4xl">
              {currentTrack ? (
                <AudioPlayer track={currentTrack} />
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <span className="material-icons text-2xl">play_arrow</span>
                  </button>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>0:00</span>
                      <span>0:00</span>
                    </div>
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-600 rounded-full w-0" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 min-w-[120px]">
              <button className={`p-2 hover:bg-gray-800 rounded-full ${!currentTrack && 'opacity-50 cursor-not-allowed'}`} disabled={!currentTrack}>
                <span className="material-icons text-gray-400">volume_up</span>
              </button>
              <button className={`p-2 hover:bg-gray-800 rounded-full ${!currentTrack && 'opacity-50 cursor-not-allowed'}`} disabled={!currentTrack}>
                <span className="material-icons text-gray-400">playlist_play</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadTrack}
      />
    </div>
  );
}
