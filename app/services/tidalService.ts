export interface TidalUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  dateCreated: string;
}

export interface TidalPlaylist {
  uuid: string;
  title: string;
  description: string;
  picture: string;
  dateCreated: string;
  lastUpdated: string;
  numberOfTracks: number;
  creator: {
    id: number;
    name: string;
  };
}

export interface TidalTrack {
  id: number;
  title: string;
  artist: {
    id: number;
    name: string;
  };
  album: {
    id: number;
    title: string;
    cover: string;
  };
  duration: number;
  url: string;
}

class TidalService {
  // This service now works with server-side API calls
  // The actual API calls will be made through Next.js API routes that can access cookies

  async getCurrentUser(): Promise<TidalUser> {
    try {
      const response = await fetch('/api/tidal/user', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401 Unauthorized - User not authenticated');
        }
        throw new Error('Failed to fetch user info');
      }

      return response.json();
    } catch (error) {
      // Re-throw the error but don't log it here since it's handled in the hook
      throw error;
    }
  }

  async getUserPlaylists(userId: number, limit: number = 50, offset: number = 0): Promise<TidalPlaylist[]> {
    const response = await fetch(
      `/api/tidal/playlists?userId=${userId}&limit=${limit}&offset=${offset}`,
      { credentials: 'include' }
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401 Unauthorized - User not authenticated');
      }
      throw new Error('Failed to fetch playlists');
    }

    const data = await response.json();
    return data.items || [];
  }

  async getPlaylistTracks(playlistId: string, limit: number = 100, offset: number = 0): Promise<TidalTrack[]> {
    const response = await fetch(
      `/api/tidal/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
      { credentials: 'include' }
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401 Unauthorized - User not authenticated');
      }
      throw new Error('Failed to fetch playlist tracks');
    }

    const data = await response.json();
    return data.items || [];
  }

  async createPlaylist(userId: number, title: string, description?: string): Promise<TidalPlaylist> {
    const response = await fetch(`/api/tidal/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId,
        title,
        description: description || '',
      }),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401 Unauthorized - User not authenticated');
      }
      throw new Error('Failed to create playlist');
    }

    return response.json();
  }

  async addTracksToPlaylist(playlistId: string, trackIds: number[]): Promise<void> {
    const response = await fetch(`/api/tidal/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        trackIds,
      }),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401 Unauthorized - User not authenticated');
      }
      throw new Error('Failed to add tracks to playlist');
    }
  }

  async searchTracks(query: string, limit: number = 20): Promise<TidalTrack[]> {
    const response = await fetch(
      `/api/tidal/search?query=${encodeURIComponent(query)}&limit=${limit}`,
      { credentials: 'include' }
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401 Unauthorized - User not authenticated');
      }
      throw new Error('Failed to search tracks');
    }

    const data = await response.json();
    return data.tracks?.items || [];
  }
}

export const tidalService = new TidalService(); 