import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('tidal_access_token')?.value;
  const userId = cookieStore.get('tidal_user_id')?.value;

  if (!accessToken || !userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit') || '50';
  const offset = searchParams.get('offset') || '0';

  try {
    const response = await fetch(
      `https://api.tidal.com/v1/users/${userId}/playlists?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/vnd.tidal.v1+json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('tidal_access_token')?.value;
  const userId = cookieStore.get('tidal_user_id')?.value;

  if (!accessToken || !userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const response = await fetch(`https://api.tidal.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.tidal.v1+json',
      },
      body: JSON.stringify({
        title,
        description: description || '',
        picture: null,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create playlist' }, { status: response.status });
    }

    const playlistData = await response.json();
    return NextResponse.json(playlistData);
  } catch (error) {
    console.error('Error creating playlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 