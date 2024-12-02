import { ScrapingResult, ProductData } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function extractProductInfo(html: string): Promise<ScrapingResult> {
  try {
    console.log('Starting product info extraction...');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Extract full description from multiple potential sources
    const descriptionMatches = [
      // Meta description
      html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i),
      html.match(/<meta\s+name="description"\s+content="([^"]+)"/i),
      // Product description div
      html.match(/<div[^>]*class="[^"]*product-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i),
      // Shopify product description
      html.match(/<div[^>]*class="[^"]*shopify-product-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i),
      // Generic product description
      html.match(/<div[^>]*id="[^"]*product-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
    ];

    let fullDescription = '';
    for (const match of descriptionMatches) {
      if (match && match[1]) {
        const description = match[1]
          .replace(/<[^>]+>/g, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        if (description.length > fullDescription.length) {
          fullDescription = description;
        }
      }
    }

    console.log('Extracted full description:', fullDescription);

    // Truncate HTML for the main extraction, but keep essential parts
    const truncatedHtml = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style tags
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
      .replace(/<!--[\s\S]*?-->/gi, '') // Remove comments
      .substring(0, 8000); // Limit size but keep more content

    const prompt = `Extract product information from this Shopify product page HTML.
    Return ONLY a JSON object with these exact keys (no markdown, no code blocks, just the JSON):
    - name: The product name (string)
    - description: The product description (string)
    - price: The current price (number)
    - original_price: The original price if available (number, optional)
    - image_urls: Array of product image URLs (array of strings)
    
    HTML content: ${truncatedHtml}`;

    console.log('Sending request to OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a JSON generator that extracts product information from HTML and returns it as a pure JSON object without any markdown formatting or code blocks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI API response received:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    let extractedInfo;
    try {
      const content = data.choices[0].message.content;
      extractedInfo = JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse product information from OpenAI response');
    }

    console.log('Extracted product info:', extractedInfo);

    // Validate and format the data, using the full description we extracted earlier
    const productData: ProductData = {
      name: String(extractedInfo.name || ''),
      description: fullDescription || String(extractedInfo.description || ''),
      price: Number(extractedInfo.price) || 0,
      originalPrice: extractedInfo.original_price ? Number(extractedInfo.original_price) : undefined,
      images: Array.isArray(extractedInfo.image_urls) ? extractedInfo.image_urls : []
    };

    // Validate required fields
    if (!productData.name) {
      throw new Error('Failed to extract product name');
    }

    return {
      success: true,
      data: productData
    };
  } catch (error) {
    console.error('Error in product info extraction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
