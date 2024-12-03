import React from "react";
import { Image, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductImagesProps {
  product: any;
  onUpdate: () => void;
}

const ProductImages = ({ product, onUpdate }: ProductImagesProps) => {
  const handleImageDelete = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("product_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;
      
      toast.success("Imagem excluída com sucesso");
      onUpdate();
    } catch (error) {
      toast.error("Falha ao excluir imagem");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from("product_images")
        .insert({
          product_id: product.id,
          url: publicUrl,
          alt_text: file.name,
        });

      if (dbError) throw dbError;

      toast.success("Imagem enviada com sucesso");
      onUpdate();
    } catch (error) {
      toast.error("Falha ao enviar imagem");
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Imagens</h2>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {product?.product_images?.map((image: any) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt={image.alt_text}
              className="w-full h-24 object-cover rounded"
            />
            <button
              onClick={() => handleImageDelete(image.id)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <label className="w-full h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-gray-50">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <Plus className="w-6 h-6 text-gray-400" />
        </label>
      </div>
    </div>
  );
};

export default ProductImages;