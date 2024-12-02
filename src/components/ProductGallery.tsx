import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const fetchProductImages = async () => {
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .order("display_order", { ascending: true });
  
  if (error) throw error;
  return data;
};

const ProductGallery = () => {
  const { data: images = [] } = useQuery({
    queryKey: ["product-images"],
    queryFn: fetchProductImages,
  });

  const [selectedImage, setSelectedImage] = useState(images[0]?.url || "");

  // Set initial selected image when images load
  React.useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setSelectedImage(images[0].url);
    }
  }, [images]);

  if (images.length === 0) {
    return <div className="text-center p-8">No images available</div>;
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        {images.map((image) => (
          <button
            key={image.id}
            className={`w-16 h-16 border rounded ${
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
      <div className="flex-1">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected product"
            className="w-full h-auto max-h-[600px] object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default ProductGallery;