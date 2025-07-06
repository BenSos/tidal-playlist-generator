import { NextResponse } from 'next/server';

if (!process.env.PERPLEXITY_API_KEY) {
  throw new Error('PERPLEXITY_API_KEY is not defined in environment variables');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;
    console.log('Received request body:', body);

    if (!prompt) {
      console.error('Missing prompt in request');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ playlist });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    );
  }
} 