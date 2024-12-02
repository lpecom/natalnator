import React from "react";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BasicProductInfoProps {
  product: any;
  onUpdate: () => void;
}

const BasicProductInfo = ({ product, onUpdate }: BasicProductInfoProps) => {
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from("landing_page_products")
        .update({
          name: formData.get("name"),
          price: Number(formData.get("price")),
          original_price: Number(formData.get("original_price")),
          stock: Number(formData.get("stock")),
        })
        .eq("id", product.id);

      if (error) throw error;
      
      toast.success("Product information updated successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to update product information");
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Basic Information</h2>
      </div>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            type="text"
            defaultValue={product.name}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product.price}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Price</label>
          <input
            name="original_price"
            type="number"
            step="0.01"
            defaultValue={product.original_price}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            name="stock"
            type="number"
            defaultValue={product.stock}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default BasicProductInfo;