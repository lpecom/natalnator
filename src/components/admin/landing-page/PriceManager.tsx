import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Package2 } from "lucide-react";

interface PriceManagerProps {
  product: any;
  onUpdate: (updates: any) => Promise<void>;
}

const PriceManager = ({ product, onUpdate }: PriceManagerProps) => {
  const handlePriceChange = async (field: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    await onUpdate({
      [field]: numValue
    });
  };

  const calculateDiscount = () => {
    if (!product.original_price || !product.price) return 0;
    return Math.round(((product.original_price - product.price) / product.original_price) * 100);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package2 className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Price Management</h2>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Regular Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className="pl-8"
                value={product.price || ''}
                onChange={(e) => handlePriceChange('price', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="original_price">Compare at Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                min="0"
                className="pl-8"
                value={product.original_price || ''}
                onChange={(e) => handlePriceChange('original_price', e.target.value)}
              />
            </div>
          </div>
        </div>

        {product.original_price > product.price && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              This product is on sale! Discount: {calculateDiscount()}% off
            </p>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Price Guidelines</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Regular Price: The current selling price</li>
            <li>• Compare at Price: Original or MSRP price (must be higher than regular price)</li>
            <li>• Variants can have additional price adjustments</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default PriceManager;