import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { ScrapingResult, ProductData } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function extractProductInfo(html: string): Promise<ScrapingResult> {
  try {
    console.log('Sending request to OpenAI...');
    
    // Validate API key
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Prepare a more focused prompt for the API
    const prompt = `Extract the following information from this Shopify product page HTML and return it as a JSON object with these exact keys:
      - name (string): The product name
      - description (string): The product description
      - price (number): The current price
      - original_price (number, optional): The original price if available
      - image_urls (array of strings): All product image URLs
      
      Return ONLY the JSON object, no additional text.
      
      HTML: ${html.substring(0, 8000)}`; // Limit HTML length

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a product data extraction assistant. Extract product information from HTML content and return it as a valid JSON object with the specified keys.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    const extractedInfo = JSON.parse(data.choices[0].message.content);
    console.log('Parsed extracted info:', extractedInfo);

    // Validate required fields
    if (!extractedInfo.name) {
      throw new Error('Failed to extract product name');
    }

    // Format the data according to our ProductData type
    const productData: ProductData = {
      name: String(extractedInfo.name),
      description: String(extractedInfo.description || ''),
      price: Number(extractedInfo.price) || 0,
      originalPrice: extractedInfo.original_price ? Number(extractedInfo.original_price) : undefined,
      images: Array.isArray(extractedInfo.image_urls) ? extractedInfo.image_urls : []
    };

    return {
      success: true,
      data: productData
    };
  } catch (error) {
    console.error('Error extracting product info with OpenAI:', error);
    return {
      success: false,
      error: error.message
    };
  }
}