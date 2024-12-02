import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    if (!doc) {
      throw new Error('Failed to parse HTML')
    }

    // Extract product name
    const name = doc.querySelector('h1')?.textContent?.trim() ||
                doc.querySelector('[data-product-title]')?.textContent?.trim() ||
                doc.querySelector('.product-title')?.textContent?.trim()
    if (!name) {
      throw new Error('Could not find product name')
    }
    console.log('Found product name:', name)

    // Get description
    const descriptionSelectors = [
      '[data-product-description]',
      '.product-description',
      '.product__description',
      '#product-description',
      '[itemprop="description"]'
    ];

    let description = '';
    for (const selector of descriptionSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        description = element.innerHTML;
        break;
      }
    }

    if (!description) {
      description = doc.querySelector('[property="og:description"]')?.getAttribute('content') || '';
    }

    console.log('Description length:', description.length)

    // Enhanced image scraping
    const imageUrls = new Set();
    
    // Try to find JSON data first (more reliable)
    const jsonScripts = doc.querySelectorAll('script[type="application/json"]');
    jsonScripts.forEach(script => {
      try {
        const jsonData = JSON.parse(script.textContent || '');
        const findImages = (obj: any) => {
          if (typeof obj !== 'object' || !obj) return;
          if (Array.isArray(obj)) {
            obj.forEach(item => findImages(item));
            return;
          }
          for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string' && 
                (key.includes('image') || key.includes('img')) && 
                value.match(/\.(jpg|jpeg|png|webp)/i) &&
                !value.includes('_thumb') && 
                !value.includes('_small')) {
              imageUrls.add(value.startsWith('//') ? `https:${value}` : value);
            } else if (typeof value === 'object') {
              findImages(value);
            }
          }
        };
        findImages(jsonData);
      } catch (e) {
        console.log('Error parsing JSON script:', e);
      }
    });

    // Fallback to DOM scraping if no images found
    if (imageUrls.size === 0) {
      const imageSelectors = [
        'img[src*="/products/"][src*=".jpg"]',
        'img[src*="/products/"][src*=".jpeg"]',
        'img[src*="/products/"][src*=".png"]',
        'img[src*="/products/"][src*=".webp"]',
        'img[data-zoom-image]',
        '.product__image img'
      ];

      for (const selector of imageSelectors) {
        doc.querySelectorAll(selector).forEach(img => {
          let imageUrl = img.getAttribute('src') || 
                        img.getAttribute('data-src') || 
                        img.getAttribute('data-zoom-image');
          
          if (imageUrl) {
            if (imageUrl.startsWith('//')) {
              imageUrl = `https:${imageUrl}`;
            }
            if (!imageUrl.includes('_thumb') && !imageUrl.includes('_small')) {
              imageUrls.add(imageUrl);
            }
          }
        });
      }
    }

    const uniqueImages = Array.from(imageUrls);
    console.log('Found images:', uniqueImages.length, uniqueImages)

    // Get price information
    const priceElement = doc.querySelector('[data-product-price]') || 
                        doc.querySelector('.price__regular') ||
                        doc.querySelector('.product__price')
    const priceText = priceElement?.textContent?.trim() || '0'
    const price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
    console.log('Found price:', price)

    const originalPriceElement = doc.querySelector('[data-compare-price]') ||
                                doc.querySelector('.price__compare')
    const originalPriceText = originalPriceElement?.textContent?.trim() || ''
    const originalPrice = parseFloat(originalPriceText.replace(/[^\d.,]/g, '').replace(',', '.')) || price

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate unique slug
    const timestamp = new Date().getTime()
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const uniqueSlug = `${baseSlug}-${timestamp}`

    // Create landing page
    const { data: landingPage, error: landingPageError } = await supabase
      .from('landing_pages')
      .insert({
        title: name,
        slug: uniqueSlug,
        status: 'draft'
      })
      .select()
      .single()

    if (landingPageError) {
      console.error('Landing page creation error:', landingPageError)
      throw new Error(`Failed to create landing page: ${landingPageError.message}`)
    }

    // Create product
    const { data: product, error: productError } = await supabase
      .from('landing_page_products')
      .insert({
        landing_page_id: landingPage.id,
        name: name,
        description_html: description,
        price: price,
        original_price: originalPrice,
        stock: 100
      })
      .select()
      .single()

    if (productError) {
      console.error('Product creation error:', productError)
      await supabase.from('landing_pages').delete().eq('id', landingPage.id)
      throw new Error(`Failed to create product: ${productError.message}`)
    }

    // Add product images
    if (uniqueImages.length > 0) {
      const productImages = uniqueImages.map((imageUrl, index) => ({
        product_id: product.id,
        url: imageUrl,
        alt_text: `${name} - Image ${index + 1}`,
        display_order: index,
        is_primary: index === 0
      }))

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(productImages)

      if (imagesError) {
        console.error('Images creation error:', imagesError)
        throw new Error(`Failed to save product images: ${imagesError.message}`)
      }
      
      console.log(`Successfully saved ${productImages.length} images`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        landingPageId: landingPage.id,
        productId: product.id,
        slug: uniqueSlug,
        imageCount: uniqueImages.length,
        descriptionLength: description.length
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