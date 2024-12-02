import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting scraping process...');
    const response = await fetch('https://luca-atacadista.catalog.kyte.site');
    const html = await response.text();
    
    console.log('HTML content length:', html.length);
    console.log('First 500 characters of HTML:', html.substring(0, 500));
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const products = [];
    
    // Try different selectors that might match product elements
    const productElements = doc.querySelectorAll('.product');
    console.log('Found products with .product:', productElements.length);
    
    const cardElements = doc.querySelectorAll('[data-product-id]');
    console.log('Found products with [data-product-id]:', cardElements.length);
    
    // Use the selector that found products
    const elements = cardElements.length > 0 ? cardElements : productElements;
    
    elements.forEach((product, index) => {
      console.log(`Processing product ${index + 1}:`);
      console.log('Product HTML:', product.outerHTML);
      
      // Try different selectors for product information
      const name = 
        product.querySelector('[data-product-name]')?.textContent?.trim() ||
        product.querySelector('.name')?.textContent?.trim() ||
        '';
      
      const price = 
        product.querySelector('[data-product-price]')?.textContent?.trim() ||
        product.querySelector('.price')?.textContent?.trim() ||
        '';
      
      const imageUrl = 
        product.querySelector('img')?.getAttribute('src') ||
        product.querySelector('[data-product-image]')?.getAttribute('src') ||
        '';
      
      console.log('Extracted data:', { name, price, imageUrl });
      
      if (name || price || imageUrl) {
        products.push({ name, price, imageUrl });
      }
    });

    console.log(`Successfully processed ${products.length} products`);

    // Create CSV content
    const csvHeader = 'Name,Price,Image URL\n';
    const csvContent = products.map(p => 
      `"${p.name}","${p.price}","${p.imageUrl}"`
    ).join('\n');
    const csv = csvHeader + csvContent;

    return new Response(csv, { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="catalog.csv"'
      } 
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})