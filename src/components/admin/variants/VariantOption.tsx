import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface VariantOptionProps {
  title: string;
  variants: any[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  onDelete: (id: string) => void;
}

const VariantOption = ({
  title,
  variants,
  selectedValue,
  onValueChange,
  onDelete,
}: VariantOptionProps) => {
  if (!variants.length) return null;

  // Format the title to be more user-friendly
  const formattedTitle = title === 'Option1' ? 'Color' : 
                        title === 'Option2' ? 'Size' : 
                        title === 'Option3' ? 'Style' : 
                        title;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{formattedTitle}</h3>
      <ToggleGroup 
        type="single" 
        value={selectedValue}
        onValueChange={onValueChange}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {variants.map((variant) => (
          <div key={variant.id} className="relative group">
            <ToggleGroupItem
              value={variant.value}
              className="w-full p-4 border-2 rounded-lg text-center transition-all data-[state=on]:border-primary data-[state=on]:bg-primary/5"
            >
              <span className="block font-medium">{variant.value}</span>
              {variant.price_adjustment !== 0 && (
                <span className="text-sm text-gray-500">
                  {variant.price_adjustment > 0 ? '+' : ''}
                  R$ {variant.price_adjustment.toFixed(2)}
                </span>
              )}
              {variant.stock !== null && (
                <span className="text-xs text-gray-400 block mt-1">
                  Stock: {variant.stock}
                </span>
              )}
            </ToggleGroupItem>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-white border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(variant.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default VariantOption;