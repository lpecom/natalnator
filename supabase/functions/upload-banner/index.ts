import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: corsHeaders, status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file')
    const type = formData.get('type')

    console.log('Processing upload request:', {
      type,
      fileName: file instanceof File ? file.name : 'not a file',
      fileType: file instanceof File ? file.type : 'not a file',
    })

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file uploaded' }),
        { headers: corsHeaders, status: 400 }
      )
    }

    if (!type || (type !== 'desktop' && type !== 'mobile')) {
      return new Response(
        JSON.stringify({ error: 'Invalid type specified' }),
        { headers: corsHeaders, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${type}/${fileName}`

    console.log('Uploading file:', { filePath, contentType: file.type })

    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, file, {
        contentType: file.type,
        duplex: 'half',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { headers: corsHeaders, status: 500 }
      )
    }

    const { data: { publicUrl } } = supabase.storage
      .from('banners')
      .getPublicUrl(filePath)

    console.log('Upload successful:', { filePath, publicUrl })

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred during upload'
      }),
      { headers: corsHeaders, status: 500 }
    )
  }
})