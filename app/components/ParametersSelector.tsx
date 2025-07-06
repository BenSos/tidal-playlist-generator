'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ParametersSelectorProps {
  onParametersSelected: (parameters: { mood: string; tempo: string } | null) => void;
}

const moods = [
  'Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Angry',
  'Nostalgic', 'Peaceful', 'Melancholic', 'Upbeat', 'Dreamy'
];

const tempos = [
  'Slow', 'Medium', 'Fast', 'Very Fast', 'Mixed'
];

export default function ParametersSelector({ onParametersSelected }: ParametersSelectorProps) {
  const [mood, setMood] = useState('');
  const [tempo, setTempo] = useState('');

  useEffect(() => {
    if (mood && tempo) {
      onParametersSelected({ mood, tempo });
    } else {
      onParametersSelected(null);
    }
  }, [mood, tempo, onParametersSelected]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Additional Parameters</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mood
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  mood === m
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tempo
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {tempos.map((t) => (
              <button
                key={t}
                onClick={() => setTempo(t)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  tempo === t
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 