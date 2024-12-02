import React from "react";
import { Package2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          price_adjustment: Number(formData.get("price_adjustment")) || 0,
          stock: Number(formData.get("stock")) || 0,
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
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package2 className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Product Variants</h2>
      </div>

      <div className="space-y-6">
        {product?.product_variants?.map((variant: any) => (
          <div 
            key={variant.id} 
            className="flex gap-4 items-start p-4 border rounded-lg bg-muted/5"
          >
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={variant.name}
                  className="mt-1"
                  readOnly
                />
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  type="text"
                  value={variant.value}
                  className="mt-1"
                  readOnly
                />
              </div>
              <div>
                <Label>Price Adjustment</Label>
                <Input
                  type="number"
                  value={variant.price_adjustment || 0}
                  className="mt-1"
                  readOnly
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={variant.stock || 0}
                  className="mt-1"
                  readOnly
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={() => handleDeleteVariant(variant.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <form onSubmit={handleAddVariant} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Color"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                name="value"
                type="text"
                placeholder="e.g., Red"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="price_adjustment">Price Adjustment</Label>
              <Input
                id="price_adjustment"
                name="price_adjustment"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                placeholder="0"
                className="mt-1"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Variant
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ProductVariants;