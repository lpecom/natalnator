import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function extractProductInfo(html: string): Promise<ScrapingResult> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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

    const data = await response.json();
    const extractedInfo = JSON.parse(data.choices[0].message.content);

    console.log('OpenAI extracted info:', extractedInfo);

    return {
      success: true,
      data: {
        name: extractedInfo.name,
        description: extractedInfo.description,
        price: extractedInfo.price,
        originalPrice: extractedInfo.original_price,
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