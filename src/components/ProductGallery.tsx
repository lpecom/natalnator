import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ProductGalleryProps {
  landingPageId?: string;
  productId?: string;
}

const fetchProductImages = async (landingPageId?: string, productId?: string) => {
  if (!landingPageId && !productId) return [];

  let query = supabase
    .from("product_images")
    .select("*")
    .order("display_order", { ascending: true });

  if (productId) {
    query = query.eq("product_id", productId);
  } else if (landingPageId) {
    // Get the product for this landing page
    const { data: product } = await supabase
      .from("landing_page_products")
      .select("*")
      .eq("landing_page_id", landingPageId)
      .single();

    if (!product) return [];
    query = query.eq("product_id", product.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const ProductGallery = ({ landingPageId, productId }: ProductGalleryProps) => {
  const { data: images = [], isLoading } = useQuery({
    queryKey: ["product-images", landingPageId, productId],
    queryFn: () => fetchProductImages(landingPageId, productId),
    enabled: !!(landingPageId || productId),
  });

  const [selectedImage, setSelectedImage] = useState(images[0]?.url || "");

  React.useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setSelectedImage(images[0].url);
    }
  }, [images]);

  if (isLoading) {
    return <div className="text-center p-4">Loading images...</div>;
  }

  if (images.length === 0) {
    return <div className="text-center p-4">No images available</div>;
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-4">
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible py-2 md:py-0">
        {images.map((image) => (
          <button
            key={image.id}
            className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 border rounded ${
              selectedImage === image.url ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => setSelectedImage(image.url)}
          >
            <img
              src={image.url}
              alt={image.alt_text || "Product image"}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      <div className="flex-1 mb-2 md:mb-0">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected product"
            className="w-full h-auto max-h-[400px] md:max-h-[600px] object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default ProductGallery;