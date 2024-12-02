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
    console.log('Scraping Shopify product:', url)

    const response = await fetch(url)
    const html = await response.text()
    
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    // Extract product information
    const name = doc.querySelector('h1')?.textContent?.trim()
    const description = doc.querySelector('[data-product-description]')?.innerHTML || 
                       doc.querySelector('.product-description')?.innerHTML ||
                       doc.querySelector('.product__description')?.innerHTML
    
    // Get all product images
    const images = Array.from(doc.querySelectorAll('.product__media img')).map(img => ({
      url: img.getAttribute('src')?.replace(/\?.*$/, '') || '',
      alt: img.getAttribute('alt') || ''
    }))

    // Get price information
    const priceElement = doc.querySelector('.price-item--regular') || 
                        doc.querySelector('.product__price')
    const price = priceElement?.textContent?.trim()
                  ?.replace(/[^\d.,]/g, '') || '0'

    const originalPriceElement = doc.querySelector('.price-item--sale') || 
                                doc.querySelector('.product__price--compare')
    const originalPrice = originalPriceElement?.textContent?.trim()
                         ?.replace(/[^\d.,]/g, '') || price

    // Get variant information if available
    const variants = Array.from(doc.querySelectorAll('.single-option-selector option, .product-form__input input[type="radio"]'))
      .map(option => ({
        name: option.getAttribute('name') || '',
        value: option.getAttribute('value') || ''
      }))

    // Create product in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First create the landing page
    const { data: landingPage, error: landingPageError } = await supabase
      .from('landing_pages')
      .insert({
        title: name,
        slug: name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: 'draft'
      })
      .select()
      .single()

    if (landingPageError) throw landingPageError

    // Then create the product
    const { data: product, error: productError } = await supabase
      .from('landing_page_products')
      .insert({
        landing_page_id: landingPage.id,
        name: name,
        description_html: description,
        price: parseFloat(price),
        original_price: parseFloat(originalPrice),
      })
      .select()
      .single()

    if (productError) throw productError

    // Add product images
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

      if (imagesError) throw imagesError
    }

    // Add product variants
    if (variants.length > 0) {
      const productVariants = variants.map(variant => ({
        product_id: product.id,
        name: variant.name,
        value: variant.value
      }))

      const { error: variantsError } = await supabase
        .from('product_variants')
        .insert(productVariants)

      if (variantsError) throw variantsError
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
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})