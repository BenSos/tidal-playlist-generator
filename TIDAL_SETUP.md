# Tidal API Setup Guide

## Prerequisites

1. Create a Tidal Developer account at https://developer.tidal.com/
2. Register your application to get API credentials

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Tidal API Configuration
# Get these from https://developer.tidal.com/
TIDAL_CLIENT_ID=your_tidal_client_id_here
TIDAL_CLIENT_SECRET=your_tidal_client_secret_here

# Redirect URI (must match what you configure in Tidal Developer Portal)
# For development, use: http://localhost:3000/api/tidal/callback
# For production, use your actual domain: https://yourdomain.com/api/tidal/callback
TIDAL_REDIRECT_URI=http://localhost:3000/api/tidal/callback
```

## Tidal Developer Portal Configuration

1. Go to https://developer.tidal.com/
2. Create a new application
3. Set the redirect URI to: `http://localhost:3000/api/tidal/callback` (for development)
4. Copy the Client ID and Client Secret to your `.env.local` file

## Available Scopes

The application requests the following Tidal API scopes:
- `playlist_read` - Read user's playlists
- `playlist_write` - Create and modify playlists
- `user_read` - Read user profile information

## Usage

The Tidal integration provides:

### API Routes
- `/api/tidal/login` - Initiates OAuth login flow
- `/api/tidal/callback` - Handles OAuth callback
- `/api/tidal/token` - Refreshes access tokens

### React Hook
```typescript
import { useTidal } from './hooks/useTidal';

function MyComponent() {
  const { 
    isAuthenticated, 
    user, 
    playlists, 
    login, 
    logout,
    createPlaylist,
    searchTracks 
  } = useTidal();

  // Use the hook methods
}
```

### Service Methods
```typescript
import { tidalService } from './services/tidalService';

// Get current user
const user = await tidalService.getCurrentUser();

// Get user playlists
const playlists = await tidalService.getUserPlaylists(userId);

// Create playlist
const playlist = await tidalService.createPlaylist(userId, 'My Playlist');

// Search tracks
const tracks = await tidalService.searchTracks('search query');
```

## Security Notes

- Access tokens are stored in httpOnly cookies
- Refresh tokens are automatically handled
- State parameter is used to prevent CSRF attacks
- All sensitive operations require valid authentication

## Error Handling

The application handles various error scenarios:
- Invalid or expired tokens
- Network errors
- API rate limiting
- User authorization failures

Check the browser console and server logs for detailed error information. 