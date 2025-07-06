import { useState } from 'react';
import { PerplexityService } from '../services/perplexityService';

interface PlaylistParams {
  genres: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  mood?: string;
  tempo?: string;
  customDescription?: string;
}

interface Song {
  title: string;
  artist: string;
  year: number;
}

export const usePerplexity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);

  const generatePlaylist = async (params: PlaylistParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = PerplexityService.getInstance();
      const result = await service.generatePlaylist(params);
      setPlaylist(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generatePlaylist,
    isLoading,
    error,
    playlist
  };
}; 