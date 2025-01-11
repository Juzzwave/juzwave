'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Track } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (track: Track) => void;
}

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('beat');
  const [tags, setTags] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const audioFiles = files.filter(file => 
      file.type === 'audio/mpeg' || file.type === 'audio/wav'
    );
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/')
    );

    if (audioFiles.length > 0) setAudioFile(audioFiles[0]);
    if (imageFiles.length > 0) setCoverImage(imageFiles[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const audioFiles = files.filter(file => 
      file.type === 'audio/mpeg' || file.type === 'audio/wav'
    );
    if (audioFiles.length > 0) setAudioFile(audioFiles[0]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) setCoverImage(imageFiles[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioFile || !title || !price) return;

    // Создаем URL для аудио файла
    const audioUrl = URL.createObjectURL(audioFile);
    
    // Создаем URL для изображения обложки или используем заглушку
    const coverImageUrl = coverImage 
      ? URL.createObjectURL(coverImage)
      : '/images/default-cover.jpg';

    // Создаем новый трек
    const newTrack: Track = {
      id: Date.now().toString(), // Временный ID
      title,
      description: '', // Можно добавить поле описания в форму
      coverImage: coverImageUrl,
      audioUrl,
      price: parseFloat(price),
      type: type as 'beat' | 'track' | 'album',
      tags: tags.split(',').map(tag => tag.trim()),
      createdAt: new Date(),
      userId: '1', // Временный ID пользователя
      plays: 0,
      likes: 0
    };

    // Отправляем трек родительскому компоненту
    onUpload(newTrack);

    // Очищаем форму
    setAudioFile(null);
    setCoverImage(null);
    setTitle('');
    setPrice('');
    setType('beat');
    setTags('');

    // Закрываем модальное окно
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-secondary rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload Track</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/10' : 'border-gray-700 hover:border-gray-600'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className="material-icons text-4xl mb-2">cloud_upload</span>
            <p className="mb-2">Drag and drop your audio file here</p>
            <p className="text-sm text-gray-400 mb-4">Supports MP3, WAV</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".mp3,.wav"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors"
            >
              Select File
            </button>
            {audioFile && (
              <div className="mt-4 text-sm text-gray-400">
                Selected: {audioFile.name}
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="flex gap-4">
            <div className="w-32 h-32 relative bg-gray-800 rounded-lg overflow-hidden">
              {coverImage ? (
                <Image
                  src={URL.createObjectURL(coverImage)}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-icons text-gray-600">image</span>
                </div>
              )}
              <input
                type="file"
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
                id="coverImage"
              />
              <label
                htmlFor="coverImage"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <span className="material-icons">add_photo_alternate</span>
              </label>
            </div>
            <div className="flex-1 space-y-4">
              <input
                type="text"
                placeholder="Track Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Price ($)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-2 gap-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="beat">Beat</option>
              <option value="track">Track</option>
              <option value="album">Album</option>
            </select>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-full transition-colors"
              disabled={!audioFile || !title || !price}
            >
              Upload Track
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 