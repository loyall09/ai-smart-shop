import { Product, AIRecommendation } from '@/types';

export async function getAIRecommendations(
  products: Product[],
  userQuery?: string
): Promise<AIRecommendation> {
  try {
    console.log('Making API call to /api/recommendations...');
    
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        products,
        userQuery
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }

    const recommendation = await response.json();
    console.log('Successfully got recommendation:', recommendation);
    return recommendation;

  } catch (error) {
    console.error('Error in getAIRecommendations:', error);
    
    // Fallback to random products
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return {
      products: shuffled.slice(0, 3),
      reason: "Here are some popular products you might enjoy!",
      theme: "Staff Picks"
    };
  }
}