import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function extractProductInfo(html: string): Promise<ScrapingResult> {
  try {
    console.log('Sending request to OpenAI...');
    
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
            content: 'You are a product data extraction assistant. Extract product information from HTML content in JSON format.'
          },
          {
            role: 'user',
            content: `Extract the following information from this Shopify product page HTML and return it as JSON:
              - Product name
              - Description
              - Price (as number)
              - Original price if available (as number)
              - Image URLs (as array)
              
              HTML: ${html.substring(0, 8000)}` // Limit HTML length
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const extractedInfo = JSON.parse(data.choices[0].message.content);
    console.log('Parsed extracted info:', extractedInfo);

    if (!extractedInfo.name) {
      throw new Error('Failed to extract product name');
    }

    return {
      success: true,
      data: {
        name: extractedInfo.name,
        description: extractedInfo.description || '',
        price: Number(extractedInfo.price) || 0,
        originalPrice: extractedInfo.original_price ? Number(extractedInfo.original_price) : undefined,
        images: extractedInfo.image_urls || []
      }
    };
  } catch (error) {
    console.error('Error extracting product info with OpenAI:', error);
    return {
      success: false,
      error: error.message
    };
  }
}