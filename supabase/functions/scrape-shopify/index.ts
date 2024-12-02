import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { extractProductInfo } from './openai-helper.ts';
import { saveProductToDatabase } from './database.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    console.log('Received URL:', url)

    if (!url) {
      throw new Error('URL is required')
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      throw new Error('Invalid URL format')
    }

    const isShopifyUrl = parsedUrl.hostname.includes('myshopify.com') || 
                        parsedUrl.pathname.includes('/products/');
    
    if (!isShopifyUrl) {
      throw new Error('Not a valid Shopify product URL')
    }

    console.log('Fetching product page from:', url)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch product page: ${response.statusText}`)
    }

    const html = await response.text()
    console.log('Received HTML content length:', html.length)

    // Extract product information using OpenAI
    const extractionResult = await extractProductInfo(html);
    if (!extractionResult.success || !extractionResult.data) {
      throw new Error(extractionResult.error || 'Failed to extract product information');
    }

    // Save to database
    const { landingPageId, slug } = await saveProductToDatabase(extractionResult.data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        landingPageId,
        slug,
        imageCount: extractionResult.data.images.length
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})