import React, { useState } from "react";
import { Package2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import VariantOption from "./variants/VariantOption";
import AddVariantForm from "./variants/AddVariantForm";

interface ProductVariantsProps {
  product: any;
  onUpdate: () => void;
}

const ProductVariants = ({ product, onUpdate }: ProductVariantsProps) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedHeight, setSelectedHeight] = useState<string>("");

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
          price_adjustment: Number(formData.get("price_adjustment")) || 0,
          stock: Number(formData.get("stock")) || 0,
          checkout_url: formData.get("checkout_url")?.toString() || "",
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

  // Group variants by their type (Color or Height)
  const colorVariants = product?.product_variants?.filter((v: any) => v.name === "Cor") || [];
  const heightVariants = product?.product_variants?.filter((v: any) => v.name === "Altura") || [];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package2 className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Product Variants</h2>
      </div>

      <div className="space-y-8">
        {/* Color Selection */}
        <VariantOption
          title="Option 1: Color"
          variants={colorVariants}
          selectedValue={selectedColor}
          onValueChange={setSelectedColor}
          onDelete={handleDeleteVariant}
        />

        {/* Height Selection */}
        <VariantOption
          title="Option 2: Height"
          variants={heightVariants}
          selectedValue={selectedHeight}
          onValueChange={setSelectedHeight}
          onDelete={handleDeleteVariant}
        />

        {/* Add Variant Form */}
        <AddVariantForm onSubmit={handleAddVariant} />
      </div>
    </Card>
  );
};

export default ProductVariants;