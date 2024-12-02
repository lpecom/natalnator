import React from "react";
import { Package2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductVariantsProps {
  product: any;
  onUpdate: () => void;
}

const ProductVariants = ({ product, onUpdate }: ProductVariantsProps) => {
  const handleAddVariant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from("product_variants")
        .insert({
          product_id: product.id,
          name: formData.get("name")?.toString() || "",
          value: formData.get("value")?.toString() || "",
        });

      if (error) throw error;
      
      toast.success("Variant added successfully");
      onUpdate();
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Failed to add variant");
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    try {
      const { error } = await supabase
        .from("product_variants")
        .delete()
        .eq("id", variantId);

      if (error) throw error;
      
      toast.success("Variant deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete variant");
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Package2 className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Variants</h2>
      </div>
      <div className="space-y-4">
        {product?.product_variants?.map((variant: any) => (
          <div key={variant.id} className="flex gap-4 items-center">
            <input
              type="text"
              value={variant.name}
              className="w-1/3 p-2 border rounded"
              readOnly
            />
            <input
              type="text"
              value={variant.value}
              className="w-2/3 p-2 border rounded"
              readOnly
            />
            <button
              onClick={() => handleDeleteVariant(variant.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <form onSubmit={handleAddVariant} className="flex gap-4 items-end">
          <div className="w-1/3">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              type="text"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="w-2/3">
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              name="value"
              type="text"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="p-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductVariants;