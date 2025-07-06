'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DateRangeSelectorProps {
  onDateRangeSelected: (range: { start: string; end: string } | null) => void;
}

export default function DateRangeSelector({ onDateRangeSelected }: DateRangeSelectorProps) {
  const [startYear, setStartYear] = useState('1990');
  const [endYear, setEndYear] = useState('2024');

  const years = Array.from(
    { length: 2024 - 1900 + 1 },
    (_, i) => (1900 + i).toString()
  ).reverse();

  useEffect(() => {
    onDateRangeSelected({
      start: startYear,
      end: endYear,
    });
  }, [startYear, endYear, onDateRangeSelected]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Choose Time Period</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startYear" className="block text-sm font-medium text-gray-300 mb-2">
            Start Year
          </label>
          <select
            id="startYear"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="endYear" className="block text-sm font-medium text-gray-300 mb-2">
            End Year
          </label>
          <select
            id="endYear"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 