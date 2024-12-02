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
    const response = await fetch('https://luca-atacadista.catalog.kyte.site');
    const html = await response.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const products = [];
    const productElements = doc.querySelectorAll('.product-item');
    
    productElements.forEach((product) => {
      const name = product.querySelector('.product-name')?.textContent?.trim() || '';
      const price = product.querySelector('.product-price')?.textContent?.trim() || '';
      const imageUrl = product.querySelector('img')?.getAttribute('src') || '';
      
      products.push({ name, price, imageUrl });
    });

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