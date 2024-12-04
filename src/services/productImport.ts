import { supabase } from "@/integrations/supabase/client";
import type { ShopifyProduct } from "../utils/csvParser";

export const importProduct = async (product: ShopifyProduct) => {
  console.log('\nImporting product:', product.Title);
  
  try {
    if (!product.Title || !product.Handle) {
      console.error('Missing required fields:', {
        hasTitle: !!product.Title,
        hasHandle: !!product.Handle
      });
      throw new Error('Missing required fields');
    }

    // Create landing page
    const { data: landingPage, error: landingPageError } = await supabase
      .from("landing_pages")
      .insert({
        title: product.Title,
        slug: product.Handle,
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

    // Create product
    const { error: productError } = await supabase
      .from("landing_page_products")
      .insert({
        landing_page_id: landingPage.id,
        name: product.Title,
        description_html: product["Body (HTML)"] || '',
        price: product["Variant Price"] ? parseFloat(product["Variant Price"]) : 0,
        source: 'shopify',
        external_metadata: { shopify_handle: product.Handle }
      });

    if (productError) {
      console.error('Product creation error:', productError);
      throw productError;
    }

    // Add product image if available
    if (product["Image Src"]) {
      const { error: imageError } = await supabase
        .from("product_images")
        .insert({
          product_id: landingPage.id,
          url: product["Image Src"],
          alt_text: product.Title,
          is_primary: true,
          display_order: 0
        });

      if (imageError) {
        console.error('Image creation error:', imageError);
        throw imageError;
      }
    }

    console.log('Product imported successfully:', product.Title);
    return true;
  } catch (error) {
    console.error("Error importing product:", error);
    return false;
  }
};