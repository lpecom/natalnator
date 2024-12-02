import React, { useState } from "react";
import { Package2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Option 1: Color</h3>
          <ToggleGroup 
            type="single" 
            value={selectedColor}
            onValueChange={setSelectedColor}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {colorVariants.map((variant: any) => (
              <div key={variant.id} className="relative group">
                <ToggleGroupItem
                  value={variant.value}
                  className="w-full p-4 border-2 rounded-lg text-center transition-all data-[state=on]:border-primary data-[state=on]:text-primary"
                >
                  <span className="block font-medium">{variant.value}</span>
                  {variant.price_adjustment > 0 && (
                    <span className="text-sm text-gray-500">
                      +R$ {variant.price_adjustment.toFixed(2)}
                    </span>
                  )}
                </ToggleGroupItem>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 bg-white border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteVariant(variant.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </ToggleGroup>
        </div>

        {/* Height Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Option 2: Height</h3>
          <ToggleGroup 
            type="single"
            value={selectedHeight}
            onValueChange={setSelectedHeight}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {heightVariants.map((variant: any) => (
              <div key={variant.id} className="relative group">
                <ToggleGroupItem
                  value={variant.value}
                  className="w-full p-4 border-2 rounded-lg text-center transition-all data-[state=on]:border-primary data-[state=on]:text-primary"
                >
                  <span className="block font-medium">{variant.value}</span>
                  {variant.price_adjustment > 0 && (
                    <span className="text-sm text-gray-500">
                      +R$ {variant.price_adjustment.toFixed(2)}
                    </span>
                  )}
                </ToggleGroupItem>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 bg-white border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteVariant(variant.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </ToggleGroup>
        </div>

        <form onSubmit={handleAddVariant} className="space-y-4 border-t pt-6">
          <h3 className="font-medium">Add New Variant</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Option Type</Label>
              <select
                id="name"
                name="name"
                className="w-full mt-1 border rounded-md p-2"
                required
              >
                <option value="Cor">Color</option>
                <option value="Altura">Height</option>
              </select>
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                name="value"
                type="text"
                placeholder="e.g., Dourada Noel"
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
            <div className="md:col-span-2">
              <Label htmlFor="checkout_url">Checkout URL</Label>
              <Input
                id="checkout_url"
                name="checkout_url"
                type="url"
                placeholder="https://..."
                className="mt-1"
                required
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