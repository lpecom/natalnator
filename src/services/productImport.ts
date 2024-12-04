import { supabase } from "@/integrations/supabase/client";
import type { ShopifyProduct } from "../types/shopify";

export const importProduct = async (productData: Record<string, string>) => {
  console.log('\nImporting product:', productData.Title);
  
  try {
    if (!productData.Handle || !productData.Title || !productData['Variant Price']) {
      console.error('Missing required fields:', {
        hasHandle: !!productData.Handle,
        hasTitle: !!productData.Title,
        hasPrice: !!productData['Variant Price']
      });
      throw new Error('Missing required fields');
    }

    // Create landing page
    const { data: landingPage, error: landingPageError } = await supabase
      .from("landing_pages")
      .insert({
        title: productData.Title,
        slug: productData.Handle,
        status: 'draft',
        template_name: 'default',
        route_type: 'product'
      })
      .select()
      .single();

    if (landingPageError) {
      console.error('Landing page creation error:', landingPageError);
      throw landingPageError;
    }

    console.log('Landing page created:', landingPage);

    // Parse tags into array
    const tags = productData.Tags ? productData.Tags.split(',').map(tag => tag.trim()) : null;

    // Create product with all Shopify fields
    const { data: productRecord, error: productError } = await supabase
      .from("landing_page_products")
      .insert({
        landing_page_id: landingPage.id,
        name: productData.Title,
        description_html: productData["Body (HTML)"] || '',
        price: parseFloat(productData["Variant Price"]) || 0,
        original_price: productData["Variant Compare At Price"] ? parseFloat(productData["Variant Compare At Price"]) : null,
        sku: productData["Variant SKU"] || null,
        source: 'shopify',
        vendor: productData.Vendor,
        product_category: productData["Product Category"],
        product_type: productData.Type,
        tags,
        published: productData.Published?.toLowerCase() === 'true',
        weight_unit: productData["Variant Weight Unit"],
        gift_card: productData["Gift Card"]?.toLowerCase() === 'true',
        included_espanha: productData["Included / Espanha"]?.toLowerCase() === 'true',
        included_brasil: productData["Included / Brasil"]?.toLowerCase() === 'true',
        included_spain: productData["Included / Spain"]?.toLowerCase() === 'true',
        status: productData.Status || 'active'
      })
      .select()
      .single();

    if (productError) {
      console.error('Product creation error:', productError);
      throw productError;
    }

    console.log('Product created:', productRecord);

    // Add product image if available
    if (productData["Image Src"]) {
      const { data: imageData, error: imageError } = await supabase
        .from("product_images")
        .insert({
          product_id: landingPage.id,
          url: productData["Image Src"],
          alt_text: productData["Image Alt Text"] || productData.Title,
          is_primary: true,
          display_order: 0
        })
        .select()
        .single();

      if (imageError) {
        console.error('Image creation error:', imageError);
        throw imageError;
      }

      console.log('Image created:', imageData);
    }

    console.log('Product imported successfully:', productData.Title);
    return true;
  } catch (error) {
    console.error("Error importing product:", error);
    return false;
  }
};