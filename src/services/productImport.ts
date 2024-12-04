import { supabase } from "@/integrations/supabase/client";
import type { ShopifyProduct } from "../types/shopify";

export const importProduct = async (productData: Record<string, string>) => {
  console.log('\nProcessing product:', productData.Title);
  
  try {
    if (!productData.Handle || !productData.Title || !productData['Variant Price']) {
      console.error('Missing required fields:', {
        hasHandle: !!productData.Handle,
        hasTitle: !!productData.Title,
        hasPrice: !!productData['Variant Price']
      });
      throw new Error('Missing required fields');
    }

    // First, check if a landing page with this handle already exists
    const { data: existingPage, error: pageCheckError } = await supabase
      .from("landing_pages")
      .select("id")
      .eq("slug", productData.Handle)
      .single();

    let landingPageId: string;

    if (!existingPage) {
      console.log('Creating new landing page for:', productData.Handle);
      
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

      landingPageId = landingPage.id;
      console.log('Created new landing page:', landingPage);
    } else {
      landingPageId = existingPage.id;
      console.log('Using existing landing page:', landingPageId);
    }

    // Check if product already exists for this landing page
    const { data: existingProduct, error: productCheckError } = await supabase
      .from("landing_page_products")
      .select("id")
      .eq("landing_page_id", landingPageId)
      .single();

    let productId: string;

    if (!existingProduct) {
      console.log('Creating new product record');
      
      // Parse tags into array
      const tags = productData.Tags ? productData.Tags.split(',').map(tag => tag.trim()) : null;

      // Create product
      const { data: productRecord, error: productError } = await supabase
        .from("landing_page_products")
        .insert({
          landing_page_id: landingPageId,
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

      productId = productRecord.id;
      console.log('Created new product:', productRecord);
    } else {
      productId = existingProduct.id;
      console.log('Using existing product:', productId);
    }

    // Add product variant
    if (productData["Option1 Name"] && productData["Option1 Value"]) {
      console.log('Adding variant:', {
        name: productData["Option1 Name"],
        value: productData["Option1 Value"]
      });

      const { data: variantRecord, error: variantError } = await supabase
        .from("product_variants")
        .insert({
          product_id: productId,
          name: productData["Option1 Name"],
          value: productData["Option1 Value"],
          price_adjustment: 0, // You might want to calculate this based on your needs
          stock: productData["Variant Inventory Qty"] ? parseInt(productData["Variant Inventory Qty"]) : 0,
          inventory_tracker: productData["Variant Inventory Tracker"] || null,
          grams: productData["Variant Grams"] ? parseInt(productData["Variant Grams"]) : null,
        })
        .select()
        .single();

      if (variantError) {
        console.error('Variant creation error:', variantError);
        throw variantError;
      }

      console.log('Created variant:', variantRecord);
    }

    // Add product image if available and if this is a new product
    if (!existingProduct && productData["Image Src"]) {
      const { data: imageData, error: imageError } = await supabase
        .from("product_images")
        .insert({
          product_id: productId,
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

      console.log('Created image:', imageData);
    }

    console.log('Product import completed successfully');
    return true;
  } catch (error) {
    console.error("Error importing product:", error);
    return false;
  }
};