import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// Use the secure server-side environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface RequestBody {
  products: Product[];
  userQuery?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('API route called');
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Request body received:', { 
      productsCount: body.products?.length, 
      userQuery: body.userQuery 
    });

    const { products, userQuery }: RequestBody = body;

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid products data' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const productData = products.map((p: Product) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      rating: p.rating,
      tags: p.tags,
      inStock: p.inStock
    }));

    const prompt = userQuery 
      ? `Based on the user's request: "${userQuery}", recommend 3-4 products from this catalog that would best match their needs. Explain why these products work well together or fulfill their request.

Available products:
${JSON.stringify(productData, null, 2)}

Please respond in this exact JSON format:
{
  "productIds": ["id1", "id2", "id3"],
  "reason": "Brief explanation of why these products were recommended",
  "theme": "A catchy theme name for this recommendation"
}`
      : `Create a surprise product recommendation from this catalog. Pick 3-4 products that would work well together for a specific use case, lifestyle, or theme. Be creative!

Available products:
${JSON.stringify(productData, null, 2)}

Please respond in this exact JSON format:
{
  "productIds": ["id1", "id2", "id3"],
  "reason": "Brief explanation of why these products work well together",
  "theme": "A catchy theme name for this recommendation"
}`;

    console.log('Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini response received');
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Invalid JSON format in Gemini response:', text);
      throw new Error('Invalid response format');
    }
    
    const aiResponse = JSON.parse(jsonMatch[0]);
    console.log('Parsed AI response:', aiResponse);
    
    // Map product IDs to actual products
    const recommendedProducts = aiResponse.productIds
      .map((id: string) => products.find((p: Product) => p.id === id))
      .filter(Boolean);

    const result_data = {
      products: recommendedProducts,
      reason: aiResponse.reason,
      theme: aiResponse.theme
    };

    console.log('Sending successful response');
    return NextResponse.json(result_data);

  } catch (error) {
    console.error('API route error:', error);
    
    // Return error response instead of fallback
    return NextResponse.json(
      { 
        error: 'Failed to get AI recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}