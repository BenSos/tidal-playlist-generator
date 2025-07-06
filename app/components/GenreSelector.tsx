'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const genres = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Electronic', 'Jazz', 'Classical',
  'Country', 'Metal', 'Folk', 'Blues', 'Reggae', 'Latin', 'Indie'
];

interface GenreSelectorProps {
  onGenresSelected: (genres: string[]) => void;
}

export default function GenreSelector({ onGenresSelected }: GenreSelectorProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
    onGenresSelected(newGenres);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Select Your Genres</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
              selectedGenres.includes(genre)
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
} 