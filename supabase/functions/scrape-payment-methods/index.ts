import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const baseUrl = 'https://primary-production-38d1.up.railway.app'
    const imagePaths = [
      '/img/001.svg',
      '/img/002.png',
      '/img/003.png',
      '/img/004.png',
      '/img/005.png',
      '/img/006.png',
      '/img/007.png',
      '/img/008.png'
    ]

    const results = []

    for (const path of imagePaths) {
      const response = await fetch(baseUrl + path)
      if (!response.ok) {
        console.error(`Failed to fetch ${path}:`, response.statusText)
        continue
      }

      const blob = await response.blob()
      const fileName = path.split('/').pop()
      const filePath = `payment-methods/${fileName}`

      const { data, error } = await supabase.storage
        .from('payment-methods')
        .upload(filePath, blob, {
          contentType: blob.type,
          upsert: true
        })

      if (error) {
        console.error(`Failed to upload ${fileName}:`, error)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('payment-methods')
        .getPublicUrl(filePath)

      results.push({ fileName, publicUrl })
    }

    return new Response(
      JSON.stringify({ message: 'Images scraped and saved successfully', results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})