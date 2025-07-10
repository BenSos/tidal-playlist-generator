'use client';

import { useState, useEffect } from 'react';
import { TidalUser, TidalPlaylist, TidalTrack, tidalService } from '../services/tidalService';

interface UseTidalReturn {
  isAuthenticated: boolean;
  user: TidalUser | null;
  playlists: TidalPlaylist[];
  loading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  refreshPlaylists: () => Promise<void>;
  createPlaylist: (title: string, description?: string) => Promise<TidalPlaylist>;
  addTracksToPlaylist: (playlistId: string, trackIds: number[]) => Promise<void>;
  searchTracks: (query: string) => Promise<TidalTrack[]>;
}

export function useTidal(): UseTidalReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<TidalUser | null>(null);
  const [playlists, setPlaylists] = useState<TidalPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    // Only check auth if we have a token cookie
    const hasToken = document.cookie.includes('tidal_access_token');
    if (hasToken) {
      checkAuthStatus();
    } else {
      // No token, so user is not authenticated
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      setPlaylists([]);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get user info to verify token is valid
      const userInfo = await tidalService.getCurrentUser();
      setUser(userInfo);
      setIsAuthenticated(true);
      
      // Load user's playlists
      await loadPlaylists(userInfo.id);
    } catch (err) {
      // Don't log 401 errors as they're expected when user is not authenticated
      if (err instanceof Error && err.message.includes('401')) {
        setIsAuthenticated(false);
        setUser(null);
        setPlaylists([]);
        setError(null); // Clear any previous errors
      } else {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
        setUser(null);
        setPlaylists([]);
        setError('Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPlaylists = async (userId: number) => {
    try {
      const userPlaylists = await tidalService.getUserPlaylists(userId);
      setPlaylists(userPlaylists);
    } catch (err) {
      console.error('Failed to load playlists:', err);
      setError('Failed to load playlists');
    }
  };

  const login = () => {
    window.location.href = '/api/tidal/login';
  };

  const logout = () => {
    // Clear cookies
    document.cookie = 'tidal_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'tidal_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'tidal_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    setIsAuthenticated(false);
    setUser(null);
    setPlaylists([]);
    setError(null);
  };

  const refreshPlaylists = async () => {
    if (user) {
      await loadPlaylists(user.id);
    }
  };

  const createPlaylist = async (title: string, description?: string): Promise<TidalPlaylist> => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      const newPlaylist = await tidalService.createPlaylist(user.id, title, description);
      setPlaylists(prev => [newPlaylist, ...prev]);
      return newPlaylist;
    } catch (err) {
      console.error('Failed to create playlist:', err);
      throw err;
    }
  };

  const addTracksToPlaylist = async (playlistId: string, trackIds: number[]): Promise<void> => {
    try {
      await tidalService.addTracksToPlaylist(playlistId, trackIds);
      // Refresh playlists to show updated track count
      await refreshPlaylists();
    } catch (err) {
      console.error('Failed to add tracks to playlist:', err);
      throw err;
    }
  };

  const searchTracks = async (query: string): Promise<TidalTrack[]> => {
    try {
      return await tidalService.searchTracks(query);
    } catch (err) {
      console.error('Failed to search tracks:', err);
      throw err;
    }
  };

  return {
    isAuthenticated,
    user,
    playlists,
    loading,
    error,
    login,
    logout,
    refreshPlaylists,
    createPlaylist,
    addTracksToPlaylist,
    searchTracks,
  };
} 