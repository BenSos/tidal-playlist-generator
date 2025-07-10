'use client';

import { useState } from 'react';
import GenreSelector from './components/GenreSelector';
import DateRangeSelector from './components/DateRangeSelector';
import ParametersSelector from './components/ParametersSelector';
import DescriptionInput from './components/DescriptionInput';
import PlaylistDisplay from './components/PlaylistDisplay';
import TidalLogin from './components/TidalLogin';

const steps = [
  { id: 'genres', title: 'Select Your Genres' },
  { id: 'date', title: 'Choose Time Period' },
  { id: 'parameters', title: 'Additional Parameters' },
  { id: 'description', title: 'Custom Description' },
  { id: 'generate', title: 'Generate Playlist' },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [parameters, setParameters] = useState<{ mood: string; tempo: string } | null>(null);
  const [description, setDescription] = useState('');
  const [playlist, setPlaylist] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const resetAll = () => {
    setCurrentStep(0);
    setSelectedGenres([]);
    setDateRange(null);
    setParameters(null);
    setDescription('');
    setPlaylist('');
    setError('');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedGenres.length > 0;
      case 1:
        return dateRange !== null;
      case 2:
        return parameters !== null;
      case 3:
        return true; // Description is optional
      default:
        return true;
    }
  };

  const handleGenerate = async () => {
    if (currentStep === steps.length - 1) {
      setIsLoading(true);
      setError('');
      setPlaylist('');

      try {
        const prompt = `Create a playlist with songs from the following genres: ${selectedGenres.join(', ')}. Include songs from ${dateRange?.start} to ${dateRange?.end}. The mood should be ${parameters?.mood} with ${parameters?.tempo.toLowerCase()} tempo. ${description ? `Additional details: ${description}` : ''}`;

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate playlist');
        }

        const data = await response.json();
        setPlaylist(data.playlist);
      } catch (err) {
        setError('Failed to generate playlist. Please try again.');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <GenreSelector onGenresSelected={setSelectedGenres} />;
      case 1:
        return <DateRangeSelector onDateRangeSelected={setDateRange} />;
      case 2:
        return <ParametersSelector onParametersSelected={setParameters} />;
      case 3:
        return <DescriptionInput onDescriptionChange={setDescription} />;
      case 4:
        return (
          <div className="space-y-4">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Generating...' : 'Generate Playlist'}
            </button>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <PlaylistDisplay playlist={playlist} isLoading={isLoading} />
            {playlist && (
              <button
                onClick={resetAll}
                className="w-full py-3 mt-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">AI Playlist Generator</h1>
        
        {/* Tidal Authentication */}
        <TidalLogin />
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-purple-400' : 'text-gray-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index <= currentStep
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>

          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>

          {currentStep < steps.length - 1 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 