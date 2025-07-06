'use client';

interface PlaylistDisplayProps {
  playlist: string;
  isLoading: boolean;
}

export default function PlaylistDisplay({ playlist, isLoading }: PlaylistDisplayProps) {
  if (isLoading) {
    return (
      <div className="mt-8 p-6 bg-gray-800 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Your Playlist</h3>
          <button
            onClick={() => {
              navigator.clipboard.writeText(playlist);
              alert('Playlist copied to clipboard!');
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
            {playlist}
          </pre>
        </div>
      </div>
    </div>
  );
} 