import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ViewLandingPage = () => {
  const { slug } = useParams();

  const { data: landingPage, isLoading } = useQuery({
    queryKey: ["landingPage", slug],
    queryFn: async () => {
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

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!landingPage) {
    return <div>Landing page not found</div>;
  }

  const product = landingPage.landing_page_products[0];

  if (!product) {
    return <div>No product found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{landingPage.title}</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {product.product_images?.map((image: any) => (
            <img
              key={image.id}
              src={image.url}
              alt={image.alt_text || product.name}
              className="w-full rounded-lg shadow-md"
            />
          ))}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold">R$ {product.price}</span>
            {product.original_price && (
              <span className="text-xl text-gray-500 line-through">
                R$ {product.original_price}
              </span>
            )}
          </div>

          {product.description && (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description_html || product.description }}
            />
          )}

          {/* Variants */}
          {product.product_variants?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Options</h3>
              <div className="grid gap-4">
                {product.product_variants.map((variant: any) => (
                  <div key={variant.id} className="flex items-center justify-between">
                    <span className="font-medium">{variant.name}</span>
                    <span>{variant.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLandingPage;