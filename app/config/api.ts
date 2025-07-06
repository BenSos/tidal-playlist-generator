export const perplexityConfig = {
  baseUrl: 'https://api.perplexity.ai'
};

// Helper function to validate API key is properly set
export const validateApiConfig = () => {
  if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error('Perplexity API key is not configured');
  }
  return true;
};

export const perplexityClient = {
  async chatCompletionsPost(params: {
    model: string;
    messages: Array<{
      role: string;
      content: string;
    }>;
  }) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}; 