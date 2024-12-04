import { supabase } from "@/integrations/supabase/client";
import type { ShopifyProduct } from "../utils/csvParser";

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const importProduct = async (product: ShopifyProduct) => {
  console.log('\nImporting product:', product.Title);
  
  try {
    if (!product.Title || !product["Variant Price"]) {
      throw new Error('Missing required fields');
    }

    // Use Handle as slug if available, otherwise generate from Title
    const slug = product.Handle || generateSlug(product.Title);
    
    console.log('Creating landing page with:', {
      title: product.Title,
      slug: slug,
      price: product["Variant Price"]
    });

    // Create landing page
    const { data: landingPage, error: landingPageError } = await supabase
      .from("landing_pages")
      .insert({
        title: product.Title,
        slug: slug,
        status: product.Status?.toLowerCase() === 'active' ? 'published' : 'draft',
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
        description_html: product["Body (HTML)"],
        price: parseFloat(product["Variant Price"]) || 0,
        original_price: parseFloat(product["Variant Compare At Price"]) || null,
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
          alt_text: product["Image Alt Text"] || product.Title,
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