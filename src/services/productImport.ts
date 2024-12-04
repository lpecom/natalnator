import { supabase } from "@/integrations/supabase/client";
import type { ShopifyProduct } from "../utils/csvParser";

export const importProduct = async (product: ShopifyProduct) => {
  console.log('\nImporting product:', product.Title);
  console.log('Product data:', JSON.stringify(product, null, 2));
  
  try {
    if (!product.Handle || !product.Title) {
      console.error('Missing required fields:', {
        hasHandle: !!product.Handle,
        hasTitle: !!product.Title
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

    console.log('Landing page created:', landingPage);

    // Parse tags into array
    const tags = product.Tags ? product.Tags.split(',').map(tag => tag.trim()) : null;

    // Create product with all Shopify fields
    const { data: productData, error: productError } = await supabase
      .from("landing_page_products")
      .insert({
        landing_page_id: landingPage.id,
        name: product.Title,
        description_html: product["Body (HTML)"] || '',
        price: product["Variant Price"] ? parseFloat(product["Variant Price"]) : 0,
        original_price: product["Variant Compare At Price"] ? parseFloat(product["Variant Compare At Price"]) : null,
        sku: product["Variant SKU"] || null,
        source: 'shopify',
        vendor: product.Vendor,
        product_category: product["Product Category"],
        product_type: product.Type,
        tags,
        published: product.Published?.toLowerCase() === 'true',
        variant_inventory_policy: product["Variant Inventory Policy"],
        variant_fulfillment_service: product["Variant Fulfillment Service"],
        requires_shipping: product["Variant Requires Shipping"]?.toLowerCase() !== 'false',
        is_taxable: product["Variant Taxable"]?.toLowerCase() !== 'false',
        barcode: product["Variant Barcode"],
        gift_card: product["Gift Card"]?.toLowerCase() === 'true',
        seo_title: product["SEO Title"],
        seo_description: product["SEO Description"],
        google_shopping_category: product["Google Shopping / Google Product Category"],
        google_shopping_gender: product["Google Shopping / Gender"],
        google_shopping_age_group: product["Google Shopping / Age Group"],
        google_shopping_mpn: product["Google Shopping / MPN"],
        google_shopping_condition: product["Google Shopping / Condition"],
        google_shopping_custom_product: product["Google Shopping / Custom Product"]?.toLowerCase() === 'true',
        google_shopping_custom_label_0: product["Google Shopping / Custom Label 0"],
        google_shopping_custom_label_1: product["Google Shopping / Custom Label 1"],
        google_shopping_custom_label_2: product["Google Shopping / Custom Label 2"],
        google_shopping_custom_label_3: product["Google Shopping / Custom Label 3"],
        google_shopping_custom_label_4: product["Google Shopping / Custom Label 4"],
        weight: product["Variant Grams"] ? parseFloat(product["Variant Grams"]) : null,
        weight_unit: product["Variant Weight Unit"],
        tax_code: product["Variant Tax Code"],
        cost_per_item: product["Cost per item"] ? parseFloat(product["Cost per item"]) : null,
        status: product.Status || 'active',
        included_espanha: product["Included / Espanha"]?.toLowerCase() === 'true',
        price_espanha: product["Price / Espanha"] ? parseFloat(product["Price / Espanha"]) : null,
        compare_price_espanha: product["Compare At Price / Espanha"] ? parseFloat(product["Compare At Price / Espanha"]) : null,
        included_brasil: product["Included / Brasil"]?.toLowerCase() === 'true',
        price_brasil: product["Price / Brasil"] ? parseFloat(product["Price / Brasil"]) : null,
        compare_price_brasil: product["Compare At Price / Brasil"] ? parseFloat(product["Compare At Price / Brasil"]) : null,
        included_spain: product["Included / Spain"]?.toLowerCase() === 'true',
        price_spain: product["Price / Spain"] ? parseFloat(product["Price / Spain"]) : null,
        compare_price_spain: product["Compare At Price / Spain"] ? parseFloat(product["Compare At Price / Spain"]) : null,
        external_metadata: { shopify_handle: product.Handle }
      })
      .select()
      .single();

    if (productError) {
      console.error('Product creation error:', productError);
      throw productError;
    }

    console.log('Product created:', productData);

    // Add product variants if they exist
    if (product["Option1 Name"] && product["Option1 Value"]) {
      const { data: variantData, error: variantError } = await supabase
        .from("product_variants")
        .insert({
          product_id: landingPage.id,
          name: product["Option1 Name"],
          value: product["Option1 Value"],
          inventory_tracker: product["Variant Inventory Tracker"],
          grams: product["Variant Grams"] ? parseInt(product["Variant Grams"]) : null,
          image_url: product["Variant Image"]
        })
        .select()
        .single();

      if (variantError) {
        console.error('Variant creation error:', variantError);
        throw variantError;
      }

      console.log('Variant created:', variantData);
    }

    // Add product image if available
    if (product["Image Src"]) {
      const { data: imageData, error: imageError } = await supabase
        .from("product_images")
        .insert({
          product_id: landingPage.id,
          url: product["Image Src"],
          alt_text: product["Image Alt Text"] || product.Title,
          is_primary: true,
          display_order: product["Image Position"] ? parseInt(product["Image Position"]) : 0
        })
        .select()
        .single();

      if (imageError) {
        console.error('Image creation error:', imageError);
        throw imageError;
      }

      console.log('Image created:', imageData);
    }

    console.log('Product imported successfully:', product.Title);
    return true;
  } catch (error) {
    console.error("Error importing product:", error);
    return false;
  }
};