import React from "react";
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
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});
  const [variants, setVariants] = React.useState(product?.product_variants || []);

  const variantGroups = React.useMemo(() => {
    if (!variants) return {};
    
    const groups: Record<string, any[]> = {};
    
    variants.forEach((variant: any) => {
      if (!groups[variant.name]) {
        groups[variant.name] = [];
      }
      groups[variant.name].push(variant);
    });
    
    console.log("Variant groups:", groups);
    return groups;
  }, [variants]);

  // Set default selections when variants are loaded
  React.useEffect(() => {
    const defaultSelections: Record<string, string> = {};
    
    Object.entries(variantGroups).forEach(([optionName, variants]) => {
      if (variants.length > 0 && !selectedOptions[optionName]) {
        defaultSelections[optionName] = variants[0].value;
      }
    });

    if (Object.keys(defaultSelections).length > 0) {
      setSelectedOptions(prev => ({ ...prev, ...defaultSelections }));
    }
  }, [variantGroups]);

  const refreshVariants = async () => {
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", product.id);

      if (error) throw error;
      console.log("Refreshed variants:", data);
      setVariants(data);
    } catch (error) {
      console.error("Error refreshing variants:", error);
      toast.error("Failed to refresh variants");
    }
  };

  const handleAddVariant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const variantData = {
      product_id: product.id,
      name: formData.get("name")?.toString() || "",
      value: formData.get("value")?.toString() || "",
      price_adjustment: Number(formData.get("price_adjustment")) || 0,
      checkout_url: formData.get("checkout_url")?.toString() || "",
    };

    console.log("Adding variant with data:", variantData);
    
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .insert(variantData);

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      toast.success("Variant added successfully");
      await refreshVariants();
      onUpdate();
      e.currentTarget.reset();
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Failed to add variant. Please check the console for details.");
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
      await refreshVariants();
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete variant");
    }
  };

  const basePrice = product?.price || 0;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package2 className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Product Variants & Pricing</h2>
      </div>

      <div className="space-y-8">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Base Product Price</h3>
          <p className="text-sm text-gray-600 mb-4">
            The base price is R$ {basePrice.toFixed(2)}. Variant prices are calculated as adjustments to this base price.
          </p>
        </div>

        {Object.entries(variantGroups).map(([optionName, variants]) => (
          <VariantOption
            key={optionName}
            title={optionName}
            variants={variants}
            selectedValue={selectedOptions[optionName]}
            onValueChange={(value) => 
              setSelectedOptions(prev => ({ ...prev, [optionName]: value }))
            }
            onDelete={handleDeleteVariant}
          />
        ))}

        <AddVariantForm onSubmit={handleAddVariant} />
      </div>
    </Card>
  );
};

export default ProductVariants;