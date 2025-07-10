import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('tidal_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const limit = searchParams.get('limit') || '20';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.tidal.com/v1/search?query=${encodeURIComponent(query)}&limit=${limit}&type=TRACKS`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/vnd.tidal.v1+json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to search tracks' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching tracks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 