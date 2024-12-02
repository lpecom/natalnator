import React, { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images.length) return null;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`w-16 h-16 border rounded ${
              selectedImage === image ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      <div className="flex-1">
        <img
          src={selectedImage}
          alt="Selected product"
          className="w-full h-auto max-h-[600px] object-contain"
        />
      </div>
    </div>
  );
};

export default ProductGallery;