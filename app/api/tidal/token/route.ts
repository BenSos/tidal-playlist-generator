import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TIDAL_CLIENT_ID = process.env.TIDAL_CLIENT_ID;
const TIDAL_CLIENT_SECRET = process.env.TIDAL_CLIENT_SECRET;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('tidal_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token available' }, { status: 401 });
  }

  if (!TIDAL_CLIENT_ID || !TIDAL_CLIENT_SECRET) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const tokenResponse = await fetch('https://auth.tidal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${TIDAL_CLIENT_ID}:${TIDAL_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!tokenResponse.ok) {
      console.error('Token refresh failed:', await tokenResponse.text());
      return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
    }

    const tokenData = await tokenResponse.json();
    
    const response = NextResponse.json({ success: true });
    
    // Update tokens
    response.cookies.set('tidal_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 3600
    });

    if (tokenData.refresh_token) {
      response.cookies.set('tidal_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30
      });
    }

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Token refresh error' }, { status: 500 });
  }
} 