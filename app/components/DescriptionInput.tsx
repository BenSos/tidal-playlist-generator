'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface DescriptionInputProps {
  onDescriptionChange: (description: string) => void;
}

const suggestions = [
  'Perfect for a workout session',
  'Relaxing evening music',
  'Road trip playlist',
  'Party mix',
  'Focus and concentration',
  'Romantic dinner'
];

export default function DescriptionInput({ onDescriptionChange }: DescriptionInputProps) {
  const [description, setDescription] = useState('');
  const maxLength = 200;

  const handleDescriptionChange = (value: string) => {
    if (value.length <= maxLength) {
      setDescription(value);
      onDescriptionChange(value);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleDescriptionChange(suggestion);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Custom Description (Optional)</h2>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Add any additional details or preferences
        </label>
        <textarea
          id="description"
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Example: Include some acoustic versions and live performances"
          className="w-full h-32 p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>
    </div>
  );
} 