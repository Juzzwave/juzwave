export interface Track {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  audioUrl: string;
  price: number;
  type: 'beat' | 'track' | 'album';
  tags: string[];
  createdAt: Date;
  userId: string;
  plays: number;
  likes: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  tracks: Track[];
  followers: number;
  following: number;
}

export interface License {
  id: string;
  name: string;
  price: number;
  features: string[];
  trackId: string;
} 