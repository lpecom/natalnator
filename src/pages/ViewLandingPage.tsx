import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";

const ViewLandingPage = () => {
  const { slug } = useParams();

  const { data: landingPage, isLoading } = useQuery({
    queryKey: ["landingPage", slug],
    queryFn: async () => {
      console.log("Fetching landing page with slug:", slug);
      const { data, error } = await supabase
        .from("landing_pages")
        .select(`
          *,
          landing_page_products (
            *,
            product_images (*),
            product_variants (*)
          )
        `)
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching landing page:", error);
        throw error;
      }
      console.log("Fetched landing page data:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!landingPage) {
    console.log("No landing page found for slug:", slug);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Landing page not found</div>
      </div>
    );
  }

  const product = landingPage.landing_page_products[0];

  if (!product) {
    console.log("No product found for landing page:", landingPage.id);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No product found</div>
      </div>
    );
  }

  const productImages = product.product_images?.map((image: any) => image.url) || [];
  console.log("Product images:", productImages);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            {productImages.length > 0 ? (
              <ProductGallery images={productImages} />
            ) : (
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                No images available
              </div>
            )}
          </div>

          {/* Product Info */}
          <ProductInfo />
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          {product.description_html ? (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description_html }}
            />
          ) : product.description ? (
            <div className="prose max-w-none">
              {product.description}
            </div>
          ) : (
            <div className="text-gray-500">No description available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLandingPage;