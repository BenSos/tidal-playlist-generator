import { perplexityClient } from '../config/api';

interface PlaylistParams {
  genres: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  mood?: string;
  tempo?: string;
  customDescription?: string;
}

export class PerplexityService {
  private static instance: PerplexityService;

  private constructor() {}

  public static getInstance(): PerplexityService {
    if (!PerplexityService.instance) {
      PerplexityService.instance = new PerplexityService();
    }
    return PerplexityService.instance;
  }

  private buildPrompt(params: PlaylistParams): string {
    let prompt = `Create a playlist with songs from the following genres: ${params.genres.join(', ')}. `;
    
    if (params.dateRange) {
      prompt += `Include songs from ${params.dateRange.start} to ${params.dateRange.end}. `;
    }
    
    if (params.mood) {
      prompt += `The mood should be ${params.mood}. `;
    }
    
    if (params.tempo) {
      prompt += `The tempo should be ${params.tempo}. `;
    }
    
    if (params.customDescription) {
      prompt += `Additional preferences: ${params.customDescription}`;
    }
    
    return prompt;
  }

  public async generatePlaylist(params: PlaylistParams) {
    try {
      const prompt = this.buildPrompt(params);
      console.log('Sending request with prompt:', prompt);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.parsePlaylistResponse(data);
    } catch (error) {
      console.error('Error generating playlist:', error);
      throw error;
    }
  }

  private parsePlaylistResponse(data: any) {
    try {
      console.log('Parsing response data:', JSON.stringify(data, null, 2));
      
      // Safely access the content
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        console.error('No content in response');
        return [];
      }

      console.log('Found content:', content);

      // Try to find JSON array in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('No JSON array found in response:', content);
        return [];
      }
      
      console.log('Found JSON match:', jsonMatch[0]);
      
      const playlist = JSON.parse(jsonMatch[0]);
      
      // Validate and format the playlist data
      if (!Array.isArray(playlist)) {
        console.error('Parsed data is not an array:', playlist);
        return [];
      }

      console.log('Successfully parsed playlist:', playlist);
      return playlist;
    } catch (error) {
      console.error('Error parsing playlist response:', error);
      return [];
    }
  }
} 