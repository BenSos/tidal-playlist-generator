import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

if (!process.env.PERPLEXITY_API_KEY) {
  throw new Error('PERPLEXITY_API_KEY is not defined in environment variables');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, createTidalPlaylist = false, playlistTitle = 'AI Generated Playlist' } = body;
    console.log('Received request body:', body);

    if (!prompt) {
      console.error('Missing prompt in request');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if user is authenticated with Tidal
    const cookieStore = await cookies();
    const tidalAccessToken = cookieStore.get('tidal_access_token')?.value;
    const tidalUserId = cookieStore.get('tidal_user_id')?.value;

    // Make request to Perplexity API
    console.log('Making request to Perplexity API with prompt:', prompt);
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: `You are a music playlist generator. You have eclectic taste in music. Create a playlist based on the user's request. 
            Format the response as a numbered list of songs, with each entry in the format:
            "Artist - Song Title (Year)"
            Include 10-15 songs that match the user's criteria.
            Do not include any additional text or explanations.
            Make sure to include a good mix of popular and lesser-known songs that fit the criteria.
            Ensure the years match the requested date range.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Perplexity API Error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || `API request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Perplexity API Response:', JSON.stringify(data, null, 2));

    // Safely access the response content
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    // Format the playlist
    const playlist = content
      .split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .join('\n');

    let tidalPlaylistId = null;

    // Create Tidal playlist if requested and user is authenticated
    if (createTidalPlaylist && tidalAccessToken && tidalUserId) {
      try {
        // Create the playlist
        const playlistResponse = await fetch('https://api.tidal.com/v1/users/' + tidalUserId + '/playlists', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tidalAccessToken}`,
            'Content-Type': 'application/vnd.tidal.v1+json',
          },
          body: JSON.stringify({
            title: playlistTitle,
            description: `AI-generated playlist: ${prompt}`,
            picture: null,
          }),
        });

        if (playlistResponse.ok) {
          const playlistData = await playlistResponse.json();
          tidalPlaylistId = playlistData.uuid;
          
          // Note: In a real implementation, you would need to search for the actual tracks
          // and add them to the playlist. This is a simplified example.
          console.log('Created Tidal playlist:', tidalPlaylistId);
        } else {
          console.error('Failed to create Tidal playlist:', await playlistResponse.text());
        }
      } catch (error) {
        console.error('Error creating Tidal playlist:', error);
      }
    }

    return NextResponse.json({ 
      playlist,
      tidalPlaylistId,
      tidalConnected: !!tidalAccessToken
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    );
  }
} 