import { NextRequest, NextResponse } from 'next/server';

const TIDAL_CLIENT_ID = process.env.TIDAL_CLIENT_ID;
const TIDAL_CLIENT_SECRET = process.env.TIDAL_CLIENT_SECRET;
const TIDAL_REDIRECT_URI = process.env.TIDAL_REDIRECT_URI || 'http://localhost:3000/api/tidal/callback';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Check for errors
  if (error) {
    return NextResponse.redirect(new URL('/?error=tidal_auth_failed', request.url));
  }

  // Verify state parameter
  const storedState = request.cookies.get('tidal_state')?.value;
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL('/?error=invalid_state', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  if (!TIDAL_CLIENT_ID || !TIDAL_CLIENT_SECRET) {
    return NextResponse.redirect(new URL('/?error=server_config', request.url));
  }

  // Get code_verifier for PKCE
  const codeVerifier = request.cookies.get('tidal_code_verifier')?.value;
  if (!codeVerifier) {
    return NextResponse.redirect(new URL('/?error=missing_code_verifier', request.url));
  }

  try {
    // Exchange authorization code for access token (with PKCE)
    const tokenResponse = await fetch('https://auth.tidal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${TIDAL_CLIENT_ID}:${TIDAL_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: TIDAL_REDIRECT_URI,
        code_verifier: codeVerifier
      })
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch('https://api.tidal.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/vnd.tidal.v1+json'
      }
    });

    if (!userResponse.ok) {
      console.error('User info fetch failed:', await userResponse.text());
      return NextResponse.redirect(new URL('/?error=user_info_failed', request.url));
    }

    const userData = await userResponse.json();

    // Create response with tokens and user data
    const response = NextResponse.redirect(new URL('/?success=tidal_connected', request.url));
    
    // Store tokens securely (in production, consider encrypting these)
    response.cookies.set('tidal_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 3600 // 1 hour default
    });

    if (tokenData.refresh_token) {
      response.cookies.set('tidal_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    }

    // Store user info
    response.cookies.set('tidal_user_id', userData.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    // Clear the state and code_verifier cookies
    response.cookies.delete('tidal_state');
    response.cookies.delete('tidal_code_verifier');

    return response;

  } catch (error) {
    console.error('Tidal callback error:', error);
    return NextResponse.redirect(new URL('/?error=callback_error', request.url));
  }
} 