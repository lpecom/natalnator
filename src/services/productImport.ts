import { supabase } from "@/integrations/supabase/client";

export const importProduct = async (productData: Record<string, string>) => {
  console.log('\nProcessing product:', productData.Title || 'Unknown Title');
  
  try {
    // Validate required fields with detailed logging
    const validation = {
      hasHandle: !!productData.Handle?.trim(),
      hasTitle: !!productData.Title?.trim(),
      hasPrice: !!productData['Variant Price']?.trim()
    };

    console.log('Field validation:', validation);

    if (!validation.hasHandle || !validation.hasTitle || !validation.hasPrice) {
      console.error('Missing required fields:', {
        Handle: productData.Handle,
        Title: productData.Title,
        'Variant Price': productData['Variant Price']
      });
      return false;
    }

    // Normalize the slug/handle
    const normalizedHandle = productData.Handle.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // First, check if a landing page with this handle already exists
    const { data: existingPage, error: pageCheckError } = await supabase
      .from("landing_pages")
      .select("id")
      .eq("slug", normalizedHandle)
      .single();

    if (pageCheckError && pageCheckError.code !== 'PGRST116') {
      console.error('Error checking existing page:', pageCheckError);
      return false;
    }

    let landingPageId: string;

    if (!existingPage) {
      console.log('Creating new landing page for:', normalizedHandle);
      
      // Create landing page
      const { data: landingPage, error: landingPageError } = await supabase
        .from("landing_pages")
        .insert({
          title: productData.Title,
          slug: normalizedHandle,
          status: 'draft',
          template_name: 'default',
          route_type: 'product',
          settings: {}
        })
        .select()
        .single();

      if (landingPageError) {
        console.error('Landing page creation error:', landingPageError);
        return false;
      }

      landingPageId = landingPage.id;
      console.log('Created new landing page:', landingPage);
    } else {
      landingPageId = existingPage.id;
      console.log('Using existing landing page:', landingPageId);
    }

    // Parse numeric values safely
    const price = parseFloat(productData["Variant Price"]) || 0;
    const comparePrice = productData["Variant Compare At Price"] ? 
      parseFloat(productData["Variant Compare At Price"]) : null;

    // Create product
    const { data: productRecord, error: productError } = await supabase
      .from("landing_page_products")
      .insert({
        landing_page_id: landingPageId,
        name: productData.Title,
        description_html: productData["Body (HTML)"] || '',
        price,
        original_price: comparePrice,
        sku: productData["Variant SKU"] || null,
        source: 'shopify',
        vendor: productData.Vendor,
        product_category: productData["Product Category"],
        product_type: productData.Type,
        tags: productData.Tags ? productData.Tags.split(',').map(tag => tag.trim()) : [],
        published: true,
        status: 'active'
      })
      .select()
      .single();

    if (productError) {
      console.error('Product creation error:', productError);
      return false;
    }

    console.log('Created new product:', {
      id: productRecord.id,
      name: productRecord.name,
      price: productRecord.price
    });

    // Add product image if available
    if (productData["Image Src"]) {
      const { data: imageData, error: imageError } = await supabase
        .from("product_images")
        .insert({
          product_id: productRecord.id,
          url: productData["Image Src"],
          alt_text: productData["Image Alt Text"] || productData.Title,
          is_primary: true,
          display_order: 0
        })
        .select()
        .single();

      if (imageError) {
        console.error('Image creation error:', imageError);
        // Don't return false here, as the product was created successfully
      } else {
        console.log('Created image:', imageData);
      }
    }

    return true;
  } catch (error) {
    console.error("Error importing product:", error);
    return false;
  }
};