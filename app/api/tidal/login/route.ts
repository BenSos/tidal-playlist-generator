import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const TIDAL_CLIENT_ID = process.env.TIDAL_CLIENT_ID;
const TIDAL_REDIRECT_URI = process.env.TIDAL_REDIRECT_URI || 'http://localhost:3000/api/tidal/callback';

function base64URLEncode(str: Buffer) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generateCodeVerifier() {
  return base64URLEncode(crypto.randomBytes(32));
}

function generateCodeChallenge(codeVerifier: string) {
  return base64URLEncode(crypto.createHash('sha256').update(codeVerifier).digest());
}

export async function GET(request: NextRequest) {
  if (!TIDAL_CLIENT_ID) {
    return NextResponse.json({ error: 'TIDAL_CLIENT_ID not configured' }, { status: 500 });
  }

  // Generate PKCE values
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Generate a random state parameter for security
  const state = Math.random().toString(36).substring(7);

  // Use correct dot notation for scopes
  const scopes = 'user.read';

  // Store state and code_verifier in cookies for verification later
  const response = NextResponse.redirect(
    `https://auth.tidal.com/v1/oauth2/authorize?` +
    `client_id=${TIDAL_CLIENT_ID}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(TIDAL_REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(scopes)}&` +
    `state=${state}&` +
    `code_challenge_method=S256&` +
    `code_challenge=${codeChallenge}`
  );

  response.cookies.set('tidal_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  });

  response.cookies.set('tidal_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  });

  return response;
} 