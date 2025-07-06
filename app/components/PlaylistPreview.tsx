import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  title: string;
  artist: string;
  year: number;
}

interface PlaylistPreviewProps {
  playlist: Track[];
  onSave: () => void;
  isSaving: boolean;
}

export default function PlaylistPreview({ playlist, onSave, isSaving }: PlaylistPreviewProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedTracks = showAll ? playlist : playlist.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg text-purple-400">Your Generated Playlist</h3>
          <span className="text-sm text-gray-400">{playlist.length} tracks</span>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {displayedTracks.map((track, index) => (
              <motion.div
                key={`${track.title}-${track.artist}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 glass-card hover:bg-purple-600/10 transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600/20 text-purple-400">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <h4 className="text-white font-medium">{track.title}</h4>
                  <p className="text-sm text-gray-400">{track.artist}</p>
                </div>
                <span className="text-sm text-gray-500">{track.year}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {playlist.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full p-2 text-sm text-purple-400 hover:text-purple-300"
          >
            {showAll ? 'Show Less' : `Show ${playlist.length - 5} More Tracks`}
          </button>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving to Tidal...</span>
            </>
          ) : (
            <span>Save to Tidal</span>
          )}
        </button>

        <p className="text-sm text-center text-gray-400">
          Your playlist will be saved to your Tidal account
        </p>
      </div>
    </div>
  );
} 