import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddVariantFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AddVariantForm = ({ onSubmit }: AddVariantFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 border-t pt-6">
      <h3 className="font-medium">Add New Variant</h3>
      <div className="grid grid-cols-5 gap-4 items-end">
        <div>
          <Label htmlFor="name">Option</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Color, Size"
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
            placeholder="e.g. Red, Large"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="original_price">Compared Price</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
            <Input
              id="original_price"
              name="original_price"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-8"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="price_adjustment">Price</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
            <Input
              id="price_adjustment"
              name="price_adjustment"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-8"
              required
            />
          </div>
        </div>
        <div>
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
        Add More...
      </Button>
    </form>
  );
};

export default AddVariantForm;