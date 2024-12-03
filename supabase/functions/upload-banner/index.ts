import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
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
      throw new Error('Invalid file uploaded')
    }

    if (!type || (type !== 'desktop' && type !== 'mobile')) {
      throw new Error('Invalid type specified')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate a clean filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${type}/${fileName}`

    console.log('Uploading file:', { filePath, contentType: file.type })

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, file, {
        contentType: file.type,
        duplex: 'half',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Failed to upload file: ${uploadError.message}`)
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('banners')
      .getPublicUrl(filePath)

    console.log('Upload successful:', { filePath, publicUrl })

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred during upload'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})