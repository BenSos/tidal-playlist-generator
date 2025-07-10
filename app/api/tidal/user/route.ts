import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('tidal_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.tidal.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.tidal.v1+json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshResponse = await fetch('/api/tidal/token', {
          method: 'POST',
        });

        if (refreshResponse.ok) {
          // Retry with new token
          const newToken = (await cookies()).get('tidal_access_token')?.value;
          if (newToken) {
            const retryResponse = await fetch('https://api.tidal.com/v1/users/me', {
              headers: {
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application/vnd.tidal.v1+json',
              },
            });

            if (retryResponse.ok) {
              return NextResponse.json(await retryResponse.json());
            }
          }
        }
      }
      
      return NextResponse.json({ error: 'Failed to fetch user info' }, { status: response.status });
    }

    const userData = await response.json();
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 