import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";

const ViewLandingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: landingPage, isLoading } = useQuery({
    queryKey: ["landingPage", slug],
    queryFn: async () => {
      if (!slug) {
        throw new Error("No slug provided");
      }

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
        .maybeSingle();

      if (error) {
        console.error("Error fetching landing page:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Landing page not found");
      }

      return data;
    },
    enabled: !!slug, // Only run query if slug exists
  });

  if (!slug) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Invalid URL</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Landing page not found</div>
      </div>
    );
  }

  const product = landingPage.landing_page_products[0];

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No product found</div>
      </div>
    );
  }

  const productImages = product.product_images?.map((image: any) => image.url) || [];

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