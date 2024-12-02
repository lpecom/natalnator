import React, { useState } from "react";

const images = [
  "/tree1.jpg",
  "/tree2.jpg",
  "/tree3.jpg",
  "/tree4.jpg",
  "/tree5.jpg",
  "/tree6.jpg",
];

const ProductGallery = () => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

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