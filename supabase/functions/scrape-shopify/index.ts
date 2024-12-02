import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    console.log('Received URL:', url)

    // Improved URL validation
    if (!url) {
      throw new Error('URL is required')
    }

    // Parse the URL to validate it's a proper URL
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      throw new Error('Invalid URL format')
    }

    // Check if it's a Shopify URL (either .myshopify.com or a custom domain with /products/)
    const isShopifyUrl = parsedUrl.hostname.includes('myshopify.com') || 
                        parsedUrl.pathname.includes('/products/');
    
    if (!isShopifyUrl) {
      throw new Error('Not a valid Shopify product URL. URL must contain "myshopify.com" or "/products/"')
    }

    console.log('Fetching product page from:', url)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch product page: ${response.statusText}`)
    }

    const html = await response.text()
    console.log('Received HTML content length:', html.length)
    
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    if (!doc) {
      throw new Error('Failed to parse HTML')
    }
    
    // Extract product information with better error handling
    const name = doc.querySelector('h1')?.textContent?.trim()
    if (!name) {
      throw new Error('Could not find product name')
    }
    console.log('Found product name:', name)

    const description = doc.querySelector('[data-product-description]')?.innerHTML || 
                       doc.querySelector('.product-description')?.innerHTML ||
                       doc.querySelector('.product__description')?.innerHTML ||
                       ''
    console.log('Found description:', description ? 'Yes' : 'No')
    
    // Get all product images
    const images = Array.from(doc.querySelectorAll('img[src*="/products/"]')).map(img => ({
      url: img.getAttribute('src')?.replace(/\?.*$/, '') || '',
      alt: img.getAttribute('alt') || ''
    })).filter(img => img.url)
    console.log('Found images count:', images.length)

    // Get price information with better selectors
    const priceElement = doc.querySelector('[data-product-price]') || 
                        doc.querySelector('.price__regular') ||
                        doc.querySelector('.product__price')
    const priceText = priceElement?.textContent?.trim() || ''
    const price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
    console.log('Found price:', price)

    const originalPriceElement = doc.querySelector('[data-compare-price]') ||
                                doc.querySelector('.price__compare') ||
                                doc.querySelector('.product__price--compare')
    const originalPriceText = originalPriceElement?.textContent?.trim() || ''
    const originalPrice = parseFloat(originalPriceText.replace(/[^\d.,]/g, '').replace(',', '.')) || price
    console.log('Found original price:', originalPrice)

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First create the landing page
    const { data: landingPage, error: landingPageError } = await supabase
      .from('landing_pages')
      .insert({
        title: name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: 'draft'
      })
      .select()
      .single()

    if (landingPageError) {
      console.error('Landing page creation error:', landingPageError)
      throw new Error(`Failed to create landing page: ${landingPageError.message}`)
    }

    if (!landingPage) {
      throw new Error('Landing page was not created')
    }

    // Then create the product
    const { data: product, error: productError } = await supabase
      .from('landing_page_products')
      .insert({
        landing_page_id: landingPage.id,
        name: name,
        description_html: description,
        price: price,
        original_price: originalPrice,
        stock: 100 // Default stock value
      })
      .select()
      .single()

    if (productError) {
      console.error('Product creation error:', productError)
      // Clean up the landing page since product creation failed
      await supabase.from('landing_pages').delete().eq('id', landingPage.id)
      throw new Error(`Failed to create product: ${productError.message}`)
    }

    if (!product) {
      // Clean up the landing page since product wasn't created
      await supabase.from('landing_pages').delete().eq('id', landingPage.id)
      throw new Error('Product was not created')
    }

    // Add product images if any exist
    if (images.length > 0) {
      const productImages = images.map((image, index) => ({
        product_id: product.id,
        url: image.url,
        alt_text: image.alt,
        display_order: index,
        is_primary: index === 0
      }))

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(productImages)

      if (imagesError) {
        console.error('Images creation error:', imagesError)
        // Don't throw here, just log the error since images are optional
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        landingPageId: landingPage.id,
        productId: product.id
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
        details: error.stack // Include stack trace for debugging
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})