import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { ProductData } from './types.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

export async function saveProductToDatabase(productData: ProductData) {
  try {
    // Generate unique slug
    const timestamp = new Date().getTime();
    const baseSlug = productData.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const uniqueSlug = `${baseSlug}-${timestamp}`;

    // Create landing page
    const { data: landingPage, error: landingPageError } = await supabase
      .from('landing_pages')
      .insert({
        title: productData.name,
        slug: uniqueSlug,
        status: 'draft'
      })
      .select()
      .single();

    if (landingPageError) throw landingPageError;

    // Create product
    const { data: product, error: productError } = await supabase
      .from('landing_page_products')
      .insert({
        landing_page_id: landingPage.id,
        name: productData.name,
        description_html: productData.description,
        price: productData.price,
        original_price: productData.originalPrice,
        stock: 100
      })
      .select()
      .single();

    if (productError) {
      await supabase.from('landing_pages').delete().eq('id', landingPage.id);
      throw productError;
    }

    // Add product images
    if (productData.images.length > 0) {
      const productImages = productData.images.map((imageUrl, index) => ({
        product_id: product.id,
        url: imageUrl,
        alt_text: `${productData.name} - Image ${index + 1}`,
        display_order: index,
        is_primary: index === 0
      }));

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(productImages);

      if (imagesError) throw imagesError;
    }

    return { landingPageId: landingPage.id, slug: uniqueSlug };
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}